import pandas as pd

def buildNutDf():
    # read csvs
    nutCsvs = ["Andriola daily servings summary 200101 thru 201231.csv","Andriola daily servings summary 210101 thru 211231.csv","Andriola daily servings summary 220101 thru 220615.csv"]
    nutCsv = pd.concat( [pd.read_csv(csv) for csv in nutCsvs], ignore_index=True)

    # fill in missing time values with average meal time
    avgMealTime = nutCsv.groupby('Group')['Time'].apply(lambda x: pd.to_datetime(x).dropna().mean())
    nutCsv['Time'] = pd.to_datetime(nutCsv['Time'])
    for meal in nutCsv['Group'].unique():
        nutCsv.loc[(nutCsv['Group'] == meal) & (nutCsv['Time'].isna()), 'Time'] = avgMealTime[meal]
    nutCsv['Time'] = nutCsv['Time'].dt.strftime('%H:%M')

    # create datetime column
    nutCsv['Datetime'] = pd.to_datetime(nutCsv['Day'] + ' ' + nutCsv['Time'])

    # summarize food stats
    columns = []
    categories = ['Alcohol (g)', 'Water (g)','Sugars (g)', 'Caffeine (mg)']
    for c in categories:
        columns.append(nutCsv.groupby(pd.Grouper(key='Datetime', freq='D'))[c].sum())

    # calculate caffeine intake before/after 6:00pm
    hour=18
    cafBefore6 = nutCsv[nutCsv['Datetime'].dt.hour < hour].groupby(pd.Grouper(key='Datetime', freq='D'))["Caffeine (mg)"].sum().rename('Caffeine Before 6 (mg)')
    cafAfter6 = nutCsv[nutCsv['Datetime'].dt.hour >= hour].groupby(pd.Grouper(key='Datetime', freq='D'))["Caffeine (mg)"].sum().rename('Caffeine After 6 (mg)')
    columns.append(cafBefore6)
    columns.append(cafAfter6)

    # return dataframe
    return pd.concat(columns, axis=1)

def buildDf():
    # read csvs
    sleepDf = pd.read_csv("oura_2020-04-14_2022-06-11_trends.csv",index_col=[0], parse_dates=[0])
    nutDf = buildNutDf()

    # merge sleep csv with nutrition data
    df = pd.concat([sleepDf, nutDf], axis=1, join='outer')
    df['Date'] = df.index

    # filter relevant columns
    columns = ['Date', 'Sleep Score', 'Total Sleep Duration', 'Awake Time', 'Bedtime Start','Bedtime End', 'Steps','Alcohol (g)', 'Water (g)','Sugars (g)', 'Caffeine (mg)', 'Caffeine Before 6 (mg)', 'Caffeine After 6 (mg)']
    df = df[columns][df["Sleep Score"].notna()]
    
    # return dataframe
    return df

def main():
    # get merged data and write to csv
    df = buildDf()
    df.to_csv("sleep.csv", index=False)

if __name__ == "__main__":
    main()