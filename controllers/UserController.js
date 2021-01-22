class UserController {
  constructor(FormId, tableId) {
    this.formEl = document.getElementById(FormId);
    this.tableEl = document.getElementById(tableId);
    this.onSubmit();
  }
  getValues(dataUsers) {
    let campos = [...this.formEl.elements];
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
        values.gender,
        values.birth,
        values.country,
        values.email,
        values.password,
        values.photo,
        values.admin
      );
      this.getPhoto().then(
        (content) => {
          objectUser.photo = content;
          this.addLine(objectUser);
        },
        function (e) {
          console.error(e);
        }
      );
    });
  }
  getPhoto() {
    return new Promise((resolve, reject) => {
      let filereader = new FileReader();

      let elements = [...this.formEl.elements].filter((item) => {
        if (item.name === "photo") return item;
      });
      let file = elements[0].files[0];

      filereader.onload = () => {
        resolve(filereader.result);
      };
      filereader.onerror = (e) => {
        reject(e);
      };
      filereader.readAsDataURL(file);
    });
  }
  addLine(dataUser) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
         <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
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
