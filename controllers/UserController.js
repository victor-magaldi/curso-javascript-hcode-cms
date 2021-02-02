class UserController {
  constructor(FormId, FormIdUpdate, tableId) {
    this.formEl = document.getElementById(FormId);
    this.tableEl = document.getElementById(tableId);
    this.formUpdateEl = document.getElementById(FormIdUpdate);
    this.onSubmit();
    this.onEdit();
  }
  getValues(dataUsers, form) {
    let campos = [...form.elements];
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
    let user = {};

    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPainelCreate();
      });

    this.formUpdateEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const btnSubmit = this.formUpdateEl.querySelector("[type=submit]");
      btnSubmit.disabled = true;
      let values = this.getValues(user, this.formUpdateEl);
      console.log(values);

      let index = this.formUpdateEl.dataset.trindex;
      let tr = this.tableEl.rows[index];

      let userOld = JSON.parse(tr.dataset.user);

      let result = Object.assign({}, userOld, values);
      console.log(userOld);
      if (!values._photo) {
        console.log(result);
        result._photo = userOld._photo;
        console.log(result);
      }
      tr.dataset.user = JSON.stringify(values);

      console.log(this.tableEl.rows[index]);

      result._register = new Date();

      tr.innerHTML = `
      <td><img src="${
        result._photo
      }" alt="User Image" class="img-circle img-sm"></td>
      <td>${result._name}</td>
      <td>${result._email}</td>
      <td>${result._admin ? "sim" : "não"}</td>
      <td>${Utils.dateFormat(result._register)}</td>
      <td>
      <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>`;

      this.addEventsTr(tr);
      this.updateCount();

      this.formUpdateEl.reset();
      btnSubmit.disabled = false;
      this.showPainelCreate();
    });
  }
  onSubmit() {
    let user = {};
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const btnSubmit = this.formEl.querySelector("[type=submit]");
      let values = this.getValues(user, this.formEl);

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
      objectUser._register = new Date();

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
      this.formEl.reset();
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
    console.log(dataUser);
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

    this.addEventsTr(tr);

    this.tableEl.appendChild(tr);

    this.updateCount();
  }

  addEventsTr(tr) {
    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      const json = JSON.parse(tr.dataset.user);

      this.formUpdateEl.dataset.trindex = tr.sectionRowIndex;

      for (let name in json) {
        const nome = name.replace("_", "");
        let field;
        if (nome) {
          field = this.formUpdateEl.querySelector(
            `[name=${name.replace("_", "")}]`
          );
        }

        if (field) {
          if (field.type == "file") continue;

          switch (field.type) {
            case "file":
              continue;

            case "radio":
              field = this.formUpdateEl.querySelector(
                "[name=" + name.replace("_", "") + "][value=" + json[name] + "]"
              );
              if (field) field.checked = true;

              break;

            case "checkbox":
              field.checked = json[name];
              break;

            default:
              field.value = json[name];
          }

          field.value = json[name];
        }
      }

      this.formUpdateEl.querySelector(".photo").src = json._photo;

      this.showPainelUpdate();
    });
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

      if (user._admin) numberAdm++;
    });
    document.getElementById("number-users").innerText = numberUser;
    document.getElementById("number-users-adm").innerText = numberAdm;
  }
}
