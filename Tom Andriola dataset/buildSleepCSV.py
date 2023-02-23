import pandas as pd

def buildCaffeineDf(hour=18):
    # read csvs
    nutCsvs = ["Andriola daily servings summary 200101 thru 201231.csv","Andriola daily servings summary 210101 thru 211231.csv","Andriola daily servings summary 220101 thru 220615.csv"]
    cafDf = pd.concat( [pd.read_csv(csv) for csv in nutCsvs], ignore_index=True)

    # create datetime column
    cafDf['Datetime'] = pd.to_datetime(cafDf['Day'] + ' ' + cafDf['Time'])

    # calculate caffeine intake before/after 6:00pm
    cafAfter6 = cafDf[cafDf['Datetime'].dt.hour >= hour].groupby(pd.Grouper(key='Datetime', freq='D'))["Caffeine (mg)"].sum().rename('Caffeine After 6 (mg)')
    cafBefore6 = cafDf[cafDf['Datetime'].dt.hour < hour].groupby(pd.Grouper(key='Datetime', freq='D'))["Caffeine (mg)"].sum().rename('Caffeine Before 6 (mg)')

    # return dataframe
    return pd.concat([cafBefore6, cafAfter6], axis=1)

def buildDf():
    # read csvs
    sleepDf = pd.read_csv("oura_2020-04-14_2022-06-11_trends.csv",index_col=[0], parse_dates=[0])
    nutDf = pd.read_csv("Nutrition Summary Jan 2019 thru July 2021 from Cronometer.csv",index_col=[0], parse_dates=[0])
    cafDf = buildCaffeineDf()

    # merge sleep csv with nutrition and 
    df = pd.concat([sleepDf, nutDf, cafDf], axis=1, join='outer')
    df['Date'] = df.index

    # filter relevant columns
    columns = ['Date', 'Sleep Score', 'Total Sleep Duration', 'Awake Time', 'Bedtime Start','Bedtime End', 'Steps','Alcohol (g)', 'Water (g)','Sugars (g)', 'Caffeine (mg)', 'Caffeine Before 6 (mg)', 'Caffeine After 6 (mg)']
    df = df[columns][df["Sleep Score"].notna()]
    
    # return dataframe
    return df

def main():
    # write csv
    df = buildDf()
    df.to_csv("sleep.csv", index=False)

if __name__ == "__main__":
    main()