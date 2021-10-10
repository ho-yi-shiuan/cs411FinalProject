const pool = require("./index");
const petQuery = require("../query/uploadPet");

// Get zip code list
const getFormData = async () => {
  const results = await pool.execute(petQuery.zipcode);
  if(results.length == 0){
    console.log("error in getzipcode function");
    return {
        code: 401,
        data: {message: "redirect to homepage"}
    }
  }
  const getBreed = await pool.execute(petQuery.getBreed);
  if(getBreed.length == 0){
    console.log("error in getBreed function");
    return {
        code: 401,
        data: {message: "redirect to homepage"}
    }
  }
  const breed = {cat:[],dog:[]};
  for(i=0;i<getBreed[0].length;i++){
    if(getBreed[0][i].category == "cat"){
      breed.cat.push({"text":getBreed[0][i].breedName,"value":getBreed[0][i].bid})
    }
    else{
      breed.dog.push({"text":getBreed[0][i].breedName,"value":getBreed[0][i].bid})
    }
  }
  const getHealth = await pool.execute(petQuery.healthIssue);
  if(getHealth.length == 0){
    console.log("error in gethealthissue function");
    return {
        code: 401,
        data: {message: "redirect to homepage"}
    }
  }
  const healthCondition = [];
  for(i=0; i<getHealth[0].length; i++){
    healthCondition.push({"text":getHealth[0][i].medicalCondition, "value":getHealth[0][i].healthID});
  }
  return {
    zipcode: results[0],
    breed: breed,
    healthCondition: healthCondition
  }
};

module.exports = {
  getFormData,
}