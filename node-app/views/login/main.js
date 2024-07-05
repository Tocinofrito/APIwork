
const button = document.getElementById("enviar");

button.addEventListener("click", () =>{
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3000/login",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({username, password})
  })
  .then(response => response.json())
  .then(data =>{
    if(data.token){
      localStorage.setItem('token', data.token);
      console.log(data);

      fetch("http://localhost:3000/protected",{
        method: "GET",
        headers:{
          "Authorization": `Bearer ${data.token}`
        }
      })
      .then(protectedResponse => protectedResponse.json())
      .then(protectedData =>{
        if(protectedData.message){
          window.location.href = "http://localhost:3000/protected";
        }
      }).catch(error =>{
        console.error("Error:",error);
      });
      //window.location.href = "http://localhost:3000/protected"
    }else{
      console.error("Error", data.message);
    }
  }).catch((error) => {
    console.error("Error:", error);
  });
});