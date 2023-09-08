import merge from 'lodash.merge'
import dotenv from 'dotenv'

dotenv.config()

const stage = process.env.NODE_ENV!

let config:any;

if(stage === "production"){
    config = require('./production').default;
}else if(stage === "development"){
    config = require('./development').default;
}else{
    config = null
    console.log("config is null")
}

const db_merge = merge(
    {
      stage,
    },
    config
  );

console.log("db_properties", db_merge)

export default config




