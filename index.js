const fields = document.querySelectorAll("#form-user-create [name]");
let user = {};
function captureValues(dataUsers, campos) {
  console.log("teste");
  campos.forEach(function (field, index) {
    if (field.name === "gender") {
      if (field.checked) {
        dataUsers[field.name] = field.value;
      }
    } else {
      dataUsers[field.name] = field.value;
    }
  });
  return dataUsers;
}
function addLine(dataUser) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
      <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin}</td>
      <td>${dataUser.data}</td>
      <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>`;
  document.getElementById("table-users").appendChild(tr);
}
document
  .getElementById("form-user-create")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let values = captureValues(user, fields);
    addLine(values);
  });
