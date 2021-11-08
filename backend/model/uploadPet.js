const pool = require("./index");
const petQuery = require("../query/uploadPet");

// Get data for upload 
const getFormData = async () => {
  return new Promise(async function(resolve, reject) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try{
        const results = await pool.execute(petQuery.zip_code);
        if(results.length == 0){
          let err = new Error('server error when getting zip_code');
          err.statusCode = 401;
          throw err;
        }
        const getBreed = await pool.execute(petQuery.getBreed);
        if(getBreed.length == 0){
          let err = new Error('server error when getting breed');
          err.statusCode = 401;
          throw err;
        }
        const breed = {cat:[],dog:[]};
        for(i=0;i<getBreed[0].length;i++){
          if(getBreed[0][i].category == "cat"){
            breed.cat.push({"text":getBreed[0][i].breed_name,"value":getBreed[0][i].bid})
          }
          else{
            breed.dog.push({"text":getBreed[0][i].breed_name,"value":getBreed[0][i].bid})
          }
        }
        const getHealth = await pool.execute(petQuery.healthIssue);
        if(getHealth.length == 0){
          let err = new Error('server error when getting health issue');
          err.statusCode = 401;
          throw err;
        }
        const healthCondition = [];
        for(i=0; i<getHealth[0].length; i++){
          healthCondition.push({"text":getHealth[0][i].medical_conditions, "value":getHealth[0][i].health_id});
        }
        await connection.commit(); 
        resolve({
            code: 200,
            data:{
              zip_code: results[0],
              breed: breed,
              healthCondition: healthCondition
            }
        })
      }catch(err){
        await connection.rollback();
        if (err.statusCode == 401){
            reject ({
                code: 401,
                data: {error:err.message}
            })
        }
        reject ({
            code: 500,
            data: {error:"server error in get upload form data"}
        })
    }finally {
        connection.release();
    }
  }).catch(err =>{
      console.log("error in get upload form: "+err.data.error);
      return err;
  })
}

module.exports = {
  getFormData,
}