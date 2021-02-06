class UserController {
  constructor(FormId, FormIdUpdate, tableId) {
    this.formEl = document.getElementById(FormId);
    this.tableEl = document.getElementById(tableId);
    this.formUpdateEl = document.getElementById(FormIdUpdate);
    this.onSubmit();
    this.onEdit();
    this.selecAll();
  }

  getValues(formEl) {
    let user = {};
    let isValid = true;

    [...formEl.elements].forEach(function (field, index) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }

      if (field.name == "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else if (field.name == "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) {
      return false;
    }

    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
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
      let values = this.getValues(this.formUpdateEl);

      let index = this.formUpdateEl.dataset.trindex;
      let tr = this.tableEl.rows[index];

      let userOld = JSON.parse(tr.dataset.user);

      let result = Object.assign({}, userOld, values);

      this.getPhoto(this.formUpdateEl).then(
        (content) => {
          if (!values.photo) {
            result._photo = userOld._photo;
          } else {
            result._photo = content;
          }

          tr.dataset.user = JSON.stringify(values);

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
            <button type="button" class="btn btn-danger btn-xs btn-delete  btn-flat">Excluir</button>
            </td>`;

          this.addEventsTr(tr);
          this.updateCount();

          this.formUpdateEl.reset();
          btnSubmit.disabled = false;
          this.showPainelCreate();
        },
        function (e) {
          console.error(e);
        }
      );
    });
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const btnSubmit = this.formEl.querySelector("[type=submit]");
      let values = this.getValues(this.formEl);

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

      this.getPhoto(this.formEl).then(
        (content) => {
          objectUser.photo = content;

          this.insert(objectUser);
          this.addLine(objectUser);

          this.formEl.reset();
          btnSubmit.disabled = false;
        },
        function (e) {
          console.error(e);
        }
      );
    });
  }

  getPhoto(formEl) {
    return new Promise((resolve, reject) => {
      let filereader = new FileReader();

      let elements = [...formEl.elements].filter((item) => {
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

  getUserStorage() {
    let users = [];
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }

  selecAll() {
    let users = this.getUserStorage("users");
    users.forEach((dataUser) => {
      const user = new User(dataUser);
      user.loadFromJson(dataUser);
      this.addLine(dataUser);
    });
  }

  insert(data) {
    const users = this.getUserStorage();

    users.push(data);
    // session Storage
    // sessionStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("users", JSON.stringify(users));
  }

  addLine(dataUser) {
    let tr = document.createElement("tr");

    tr.dataset.user = JSON.stringify(dataUser);
    tr.innerHTML = `
         <td><img src="${
           dataUser._photo
         }" alt="User Image" class="img-circle img-sm"></td>
         <td>${dataUser._name}</td>
         <td>${dataUser._email}</td>
         <td>${dataUser._admin ? "sim" : "não"}</td>
         <td>${Utils.dateFormat(new Date(dataUser._register))}</td>
         <td>
         <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
         <button type="button" class="btn btn-danger btn-xs btn-delete  btn-flat">Excluir</button>
         </td>`;

    this.addEventsTr(tr);

    this.tableEl.appendChild(tr);

    this.updateCount();
  }

  addEventsTr(tr) {
    tr.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("deseja excluir?")) {
        tr.remove();
        this.updateCount();
      }
    });
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
