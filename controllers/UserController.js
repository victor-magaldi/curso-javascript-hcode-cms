class UserController {
  constructor(FormId, tableId) {
    this.formEl = document.getElementById(FormId);
    this.tableEl = document.getElementById(tableId);
    this.onSubmit();
    this.onEdit();
  }
  getValues(dataUsers) {
    let campos = [...this.formEl.elements];
    let isValid = true;
    campos.forEach(function (field, index) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }
      if (field.name == "gender") {
        if (field.checked) {
          dataUsers[field.name] = field.value;
        }
      } else if (field.name == "admin") {
        dataUsers[field.name] = field.checked ? true : false;
      } else {
        dataUsers[field.name] = field.value;
      }
    });
    if (!isValid) {
      return false;
    }
    return dataUsers;
  }
  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPainelCreate();
      });
  }
  onSubmit() {
    let user = {};
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const btnSubmit = this.formEl.querySelector("[type=submit]");
      let values = this.getValues(user, this.formEl.elements);

      if (!values) return false;
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
      btnSubmit.disabled = true;

      this.getPhoto().then(
        (content) => {
          objectUser.photo = content;
          this.addLine(objectUser);
          btnSubmit.disabled = false;
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
      if (file) {
        filereader.readAsDataURL(file);
      } else {
        resolve("dist/img/boxed-bg.jpg");
      }
    });
  }
  addLine(dataUser) {
    let tr = document.createElement("tr");
    tr.dataset.user = JSON.stringify(dataUser);
    tr.innerHTML = `
         <td><img src="${
           dataUser.photo
         }" alt="User Image" class="img-circle img-sm"></td>
         <td>${dataUser.name}</td>
         <td>${dataUser.email}</td>
         <td>${dataUser.admin ? "sim" : "não"}</td>
         <td>${Utils.dateFormat(dataUser.register)}</td>
         <td>
         <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
         <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
         </td>`;
    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      const json = JSON.parse(tr.dataset.user);
      const form = document.getElementById("form-user-update");
      for (let name in json) {
        document.getElementById("form-user-update");
        let field = form.querySelector(`[name=${name.replace("_", "")}]`);

        if (field) {
          if (field.type == "file") continue;

          field.value = json[name];
        }
      }
      this.showPainelUpdate();
    });
    this.tableEl.appendChild(tr);

    this.updateCount();
  }
  showPainelCreate() {
    document.getElementById("box-user-create").style.display = "block";
    document.getElementById("box-user-update").style.display = "none";
  }
  showPainelUpdate() {
    document.getElementById("box-user-create").style.display = "none";
    document.getElementById("box-user-update").style.display = "block";
  }

  updateCount() {
    let numberUser = 0;
    let numberAdm = 0;

    const tableLis = [...this.tableEl.children];
    tableLis.forEach((item) => {
      numberUser++;
      const user = JSON.parse(item.dataset.user);
      console.log(user, user._admin);
      if (user._admin) numberAdm++;
    });
    document.getElementById("number-users").innerText = numberUser;
    document.getElementById("number-users-adm").innerText = numberAdm;
  }
}
