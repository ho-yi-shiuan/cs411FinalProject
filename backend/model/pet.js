const pool = require("./index");
const petQuery = require("../query/pet");
let SqlString = require('sqlstring');

// Get all pet list 
const getPetList = async () => {
  const results = await pool.execute(petQuery.AllPets);
  if(results[0].length == 0){
    console.log("error in getPetList function");
    return {
        code: 401,
        data: {message: "redirect to signin page"}
    }
  }
  for(i=0;i<results[0].length;i++){
    results[0][i].picture = "https://brownie.yssites.com/PetImage/"+results[0][i].picture;
  }
  return {
      data: results[0]
  };
};

// Post new uploaded pet data
const InsertPet = (contact, status, date, picture, name, breed, category, age, color, size, gender, chip_status, health_issue, zip_code, mark_solved) => {
  return new Promise(async function(resolve, reject) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try{
      const healthIssueArray = [];
      if(health_issue == "undefined"){
          injured_flag = 0;
      }else{
          injured_flag = 1;
          const IssueArray = health_issue.split(",");
          for(i=0;i<IssueArray.length;i++){
            healthIssueArray.push(JSON.parse(IssueArray[i]));
          }
      }
      if(chip_status == "null"){
          chip_status = 0;
      }
      if(name == "null"){
        name = null;
      }
      if(gender == "null"){
        gender = null;
      }
        
      const insertPet = await connection.execute(petQuery.InsertPet,[JSON.parse(contact), status, date, picture, name, JSON.parse(breed), category, JSON.parse(age), color, size, gender, chip_status, injured_flag, JSON.parse(zip_code), mark_solved]);
      if(insertPet[0].length == 0){
        await connection.rollback(function(){
          console.log("error in InsertPet function");
          connection.release();
          reject({
            code: 401,
            data: {message: "redirect to signin page"}
          })
        });	
      }
      //insertPet[0].insertId,
      let hasArray = "";
      for(i=0;i<healthIssueArray.length;i++){
        hasArray+= "("+insertPet[0].insertId+","+healthIssueArray[i]+"),"
        //hasArray.push([insertPet[0].insertId,healthIssueArray[i]]);
      }
      //console.log('sql: ', SqlString.format(petQuery.InsertHas+hasArray.slice(0, hasArray.length - 1)));//,[hasArray]));
      const results = await connection.execute(petQuery.InsertHas+hasArray.slice(0, hasArray.length - 1));//,[hasArray]);
      if(results[0].length == 0){
        await connection.rollback(function(){
          console.log("error in InsertPet function");
          connection.release();
          reject({
            code: 401,
            data: {message: "redirect to signin page"}
          })
        });	
      }
      await connection.commit(); 
      resolve({
        code: 200,
        data: {message: "insert has table success"}
      })
    } catch(err){
      console.log("error in catch:");
      console.log(err);
      await connection.rollback(function(){
        connection.release();
        res.status(500).send({error: "db query error in insert pet"});
      })
    }
  });
};

//Search data in pet
const SearchPet = (status, dateStart, dateEnd, breed, category, color, size, gender, chip_status, health_issue, zip_code) => {
  return new Promise(async function(resolve, reject) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try{
      let selectQuery = "SELECT * FROM PET";
      let queryArray = [];
      const condition = [];
      if(zip_code !== null && zip_code !== ""){
        queryArray.push("zip_code = ?")
        condition.push(zip_code);
      }
      if(status !== null && status.length>0){
        queryArray.push("status IN (?)")
        condition.push(status);
      }
      if(dateStart !== dateEnd){
        queryArray.push("date BETWEEN \""+dateStart+"\" AND \""+dateEnd+"\"")
      }
      if(breed !== null){
        queryArray.push("bid = ?")
        condition.push(breed);
      }
      if(category !== null){
        queryArray.push("category = ?")
        condition.push(category);
      }
      if(color !== null){
        for(i=0;i<color.length;i++){
          queryArray.push("color LIKE ?")
          condition.push("\%"+color[i]+"\%");
        }
      }
      if(size !== null && size.length>0){
        queryArray.push("size IN (?)")
        condition.push(size);
      }
      if(gender !== null && gender.length>0){
        queryArray.push("gender IN (?)")
        condition.push(gender);
      }
      if(chip_status !== null){
        queryArray.push("chip_status = ?")
        condition.push(chip_status);
      }
      if(condition.length > 0){
        for(i=0;i<queryArray.length;i++){
          if(i==0){
            selectQuery += " WHERE "+queryArray[i]
          }else{
            selectQuery += " AND "+queryArray[i]
          }
        }
      }
      console.log('select sql: ', SqlString.format(selectQuery,condition));
      console.log(condition);
      const results = await connection.execute(selectQuery,condition);
      console.log(results[0].length);
      for(i=0;i<results[0].length;i++){
        results[0][i].picture = "https://brownie.yssites.com/PetImage/"+results[0][i].picture;
      }
      resolve({
        code: 200,
        data: results[0]
      });
    } catch(err){
      console.log("error in catch:");
      console.log(err);
      await connection.rollback(function(){
        connection.release();
        res.status(500).send({error: "db query error in search pet"});
      })
    }
  });
};

module.exports = {
  getPetList,
  InsertPet,
  SearchPet
}