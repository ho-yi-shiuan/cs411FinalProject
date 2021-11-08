const pool = require("./index");
const petQuery = require("../query/pet");
let SqlString = require('sqlstring');
const date = require('date-and-time');

// Get all pet list 
const getPetList = async () => {
  return await pool.execute(petQuery.AllPets).then((results) =>{
    for(i=0;i<results[0].length;i++){
      results[0][i].picture = "https://brownie.yssites.com/PetImage/"+results[0][i].picture;
      results[0][i].date = date.format(results[0][i].date, "YYYY/MM/DD");
    }
    return {
        data: results[0]
    };
  }).catch((err) =>{
    console.log("error in getPetList function");
    console.log(err);
    res.status(500).send({error: "db query error in in get pet data for main page"});
  })
};

// Post new uploaded pet data
const InsertPet = (contact, status, date, picture, name, breed, category, age, color, size, gender, chip_status, health_issue, zip_code, mark_solved) => {
  return new Promise(async function(resolve, reject) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try{
      const healthIssueArray = [];
      if(health_issue == "null" || health_issue == ""){
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
      return await connection.execute(petQuery.InsertPet,[JSON.parse(contact), status, date, picture, name, JSON.parse(breed), category, JSON.parse(age), color, size, gender, chip_status, injured_flag, JSON.parse(zip_code), mark_solved]).then(async (insertPet) =>{
        if(insertPet[0].length == 0){
          throw new Errors.NoContent('insert pet failed');
        }
        if(healthIssueArray.length > 0){
          let hasArray = [];
          for(i=0;i<healthIssueArray.length;i++){
            hasArray.push([insertPet[0].insertId,healthIssueArray[i]]);
          }
          return await connection.query(petQuery.InsertHas,[hasArray]).then(async (results) =>{
            if(results[0].length == 0){
              throw new Errors.NoContent('insert has failed');
            }
            await connection.commit(); 
            resolve({
              code: 200,
              data: {message: "insert pet and has table success"}
            })      
          }).catch((err) =>{
            throw err;
          })
        }
        await connection.commit(); 
        resolve({
          code: 200,
          data: {message: "insert pet success"}
        })
      }).catch((err) =>{
        throw err;
      })
    } catch(err){
      console.log("error in insertpet function");
      console.log(err);
      await connection.rollback(function(){
        connection.release();
        if (err instanceof Errors.NoContent){
          return res.status(HttpStatus.NO_CONTENT).send({ message: err.message });
        }
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message });
      })
    }
  });
};

//Search data in pet
const SearchPet = async (status, dateStart, dateEnd, breed, category, color, size, gender, chip_status, health_issue, zip_code) => {
  try{
    let selectQuery = "SELECT * FROM PET LEFT JOIN ZIPCODE ON ZIPCODE.zip_code = PET.zip_code ";
    let queryArray = [];
    const condition = [];
    if(zip_code !== null && zip_code !== ""){
      queryArray.push("PET.zip_code = ?")
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
    if(health_issue !== null && health_issue.length>0){
      queryArray.push("pet_id IN (SELECT DISTINCT pet_id FROM Has WHERE health_id IN (?))")
      condition.push(health_issue);        
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
    return await pool.query(selectQuery,condition).then((results) =>{
      for(i=0;i<results[0].length;i++){
        results[0][i].picture = "https://brownie.yssites.com/PetImage/"+results[0][i].picture;
      }
      return {
        data: results[0]
      };
    }).catch((err) =>{
      throw err;
    })
  }catch(err){
    console.log("error in searchPet function");
    console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message });
  }
};

const deletePet = async (pet_id) => {
  //deletepet by pet id
  return await pool.query(petQuery.deletePet,[pet_id]).then((results) =>{
    return ({data:{deleteStatus:"success"}})
  }).catch((err) =>{
    console.log("error in deletePet function");
    console.log(err);
    return ({
      code: 500,
      data: {error:"server error in delete"}      
    })
  })
};

const updatePet = async (data) => {
  let newData = {
    date: data.date,
    name: data.name,
    category: data.category,
    age: data.age,
    size: data.size,
    gender: data.gender,
    chip_status: data.chip_status,
    zip_code: data.zip_code
  }
  let updatePet = [data.date,data.name,data.category,data.age,data.size,data.gender,data.chip_status,data.zip_code,data.pet_id];
  return await pool.query(petQuery.updatePet,updatePet).then((results) =>{
    return ({data:{updateStatus:"success"}})
  }).catch((err) =>{
    console.log("error in updatePet function");
    console.log(err);
    return ({
      code: 500,
      data: {error:"server error in update"}      
    })
  })
};

const showCountOfLostAfter2019 = async () => {
  return await pool.query(petQuery.showCountOfLostAfter2019).then((results) =>{
    return ({data:results[0]})
  }).catch((err) =>{
    console.log("error in showing count of lost pet after 2019");
    console.log(err);
    return ({
      code: 500,
      data: {error:"server error in showing count of lost pet after 2019"}      
    })
  })  
};

const showCatCommonHealthIssue = async () => {
  return await pool.query(petQuery.showCatCommonHealthIssue).then((results) =>{
    return ({data:results[0]})
  }).catch((err) =>{
    console.log("error in showing cats' common health issue");
    console.log(err);
    return ({
      code: 500,
      data: {error:"error in showing cats' common health issue"}      
    })
  })  
};

module.exports = {
  getPetList,
  InsertPet,
  SearchPet,
  updatePet,
  deletePet,
  showCountOfLostAfter2019,
  showCatCommonHealthIssue
}