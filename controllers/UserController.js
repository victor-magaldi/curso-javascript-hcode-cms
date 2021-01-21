class UserController {
  constructor(FormId, tableId) {
    this.formEl = document.getElementById(FormId);
    this.tableEl = document.getElementById(tableId);
    this.onSubmit();
  }
  getValues(dataUsers) {
    let campos = Array.from(this.formEl.elements);
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
  onSubmit() {
    let user = {};
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let values = this.getValues(user, this.formEl.elements);
      let objectUser = new User(
        values.name,
        values.birth,
        values.country,
        values.email,
        values.password,
        values.photo,
        values.admin
      );
      this.addLine(objectUser);
    });
  }
  addLine(dataUser) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
         <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
         <td>${dataUser.name}</td>
         <td>${dataUser.email}</td>
         <td>${dataUser.admin}</td>
         <td>${dataUser.birth}</td>
         <td>
         <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
         <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
         </td>`;
    this.tableEl.appendChild(tr);
  }
}
