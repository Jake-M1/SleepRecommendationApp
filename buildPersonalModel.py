import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import json

seed = 1234
np.random.seed(seed)

def getFeaturesAndLabels(file):
    df = pd.read_csv(file,parse_dates=[0])

    # standardize timezones
    df["Bedtime Start"]=pd.to_datetime(df["Bedtime Start"],utc=True).dt.tz_convert(tz="US/Pacific").dt.tz_localize(tz=None)
    df["Bedtime End"]=pd.to_datetime(df["Bedtime End"],utc=True).dt.tz_convert(tz="US/Pacific").dt.tz_localize(tz=None)

    # convert datetime into seconds
    df["Bedtime End"]=(df["Bedtime End"]-df["Date"]).dt.total_seconds()
    df["Bedtime Start"]=(df["Bedtime Start"]-df["Date"]).dt.total_seconds()

    X = df[df.columns[2:]].to_numpy()
    y = df["Sleep Score"].to_numpy()

    return X,y

def splitData(X, y, valSize=0.2, testSize=0.2):
    # split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=testSize, random_state=seed)
    
    # split training set into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=valSize/(1 - testSize), random_state=seed)
    
    return X_train, X_val, X_test, y_train, y_val, y_test

def convertToPersonalModel(values):
    keys = ['Total Sleep Duration', 'Awake Time', 'Bedtime Start','Bedtime End', 'Steps','Alcohol (g)', 'Water (g)','Sugars (g)', 'Caffeine (mg)', 'Caffeine Before 6 (mg)', 'Caffeine After 6 (mg)']
    personalModel = dict(zip(keys,np.around(values,decimals=2)))

    # convert seconds to time format
    personalModel['Bedtime Start'] = str(pd.to_datetime(86400+values[2], unit='s').strftime('%H:%M:%S')) 
    personalModel["Bedtime End"] = str(pd.to_datetime(values[3], unit='s').strftime('%H:%M:%S'))
    return personalModel

def bulidPersonalModel(file="Tom Andriola dataset/sleep.csv"):
    uX, y = getFeaturesAndLabels(file)

    # scale data and split into train/test sets
    scaler = StandardScaler()
    X = scaler.fit_transform(uX)
    X_train, X_val, X_test, y_train, y_val, y_test = splitData(X,y)
    y_train1 = y_train.reshape(-1,1)
    y_val1 = y_val.reshape(-1,1)

    # train models to predict features given sleep score
    outputs = []
    for i in range(X_train.shape[1]):
        clf = RandomForestRegressor(
            n_estimators=2000,
            random_state=seed)
        clf.fit(y_train1,X_train[:,i])

        # predict the optimal feature value for a sleep score of 100
        outputs.append(clf.predict([[100]]))
 
    # unscale and format data
    outputs = np.array(scaler.inverse_transform([np.concatenate(outputs)])[0])
    personalModel = convertToPersonalModel(outputs)

    with open('personalModel.json', 'w') as f:
        json.dump(personalModel, f, indent=4)

    return personalModel

def main():
    bulidPersonalModel()

if __name__ == "__main__":
    main()



