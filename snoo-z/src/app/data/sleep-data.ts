export class SleepData{
    date:string;
    bedtime_start:string;
    bedtime_end:string;
    sleep_score:number;
    total_sleep_duration:number;
    awake_time:number;
    steps:number;
    water:number;
    sugar:number;
    caffeine:number;
    caffeine_before:number;
    caffeine_after:number;
    alcohol:number;

    constructor(objectModel:any){
        this.date = objectModel['date'];
        this.bedtime_start = objectModel['bedtime_start'];
        this.bedtime_end = objectModel['bedtime_end'];
        this.sleep_score = objectModel['sleep_score'];
        this.total_sleep_duration = objectModel['total_sleep_duration'];
        this.awake_time = objectModel['awake_time'];
        this.steps = objectModel['steps'];
        this.water = objectModel['water'];
        this.sugar = objectModel['sugar'];
        this.caffeine = objectModel['caffeine'];
        this.caffeine_before = objectModel['caffeine_before'];
        this.caffeine_after = objectModel['caffeine_after'];
        this.alcohol = objectModel['alcohol'];

    }
    getDate(){
        return this.date;
    }

    getBedtimeStart(){
        return this.bedtime_start;
    }

    getBedtimeEnd(){
        return this.bedtime_end;
    }

    getSleepScore(){
        return this.sleep_score;
    }

    getTotalSleepDuration(){
        return this.total_sleep_duration;
    }

    getAwakeTime(){
        return this.awake_time;
    }

    getSteps(){
        return this.steps;
    }

    getWater(){
        return this.water;
    }
    getSugar(){
        return this.sugar;
    }

    getCaffeine(){
        return this.caffeine;
    }

    getCaffeineBefore(){
        return this.getCaffeineBefore;
    }

    getCaffeineAfter(){
        return this.getCaffeineAfter;
    }
}