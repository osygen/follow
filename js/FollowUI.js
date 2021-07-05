import Factory from "./Factory.js";

class FollowUI extends Factory {
  #deleteBox;
  #popUpEvent;
  #more;
  #statusBox;
  #temp = [];
  #cancel;
  #deleteStatus;
  #deleteBoxE;
  #root = document.documentElement;
  #form = document.querySelector("form");
  #nav = document.querySelector(".nav");
  #secs = document.querySelectorAll(".sec");
  #btnMore = `
        <div class="status-popup hidden scaleAnimation">
          <span class="share"><a href="#">share</a></span>
          <span class="edit"><a href="#">edit</a></span>
          <span class="deleteOpt"><a href="#">delete</a></span>
          <span class="privacy"><a href="#">privacy</a></span>
          <span class="report"><a href="#">report</a></span>
        </div>`;
  #deleteBoxTemplate = `
        <div class="delete-box scaleAnimation">
          <h3>DELETE</h3>
          <p class="delete-content">you are about to delete this post, do you want to continue?</p>
          <p class="delete-dialog">
            <span class="delete"><a href="#">delete</a></span>
            <span class="cancel"><a href="#">cancel</a></span>
          </p>
        </div>`;

  #statusContent;
  #panelE;
  #panel;
  #panelString = `<div id="panel">
            <!--<h2>post</h2>-->
          </div> `;

  constructor() {
    super();

    ["click", "submit", "toggle"].some((type, i, arr) => {
      this.#root.addEventListener(type, this.rootHandler.bind(this, arr));
    });

    this.#secs?.forEach((s) => this.secObserver().observe(s));
    this.#form ? this.navObserver().observe(this.#form) : undefined;
  }

  rootHandler(arr, e) {
    e.type === arr[0]
      ? this.clickHandler(e)
      : e.type === arr[1]
      ? this.submitForm(e)
      : alert("event not handled!");
  }

  submitForm(e) {
    if (!e.target.closest("#post-form") && !e.target.closest("#com-ply"))
      return;
    e.preventDefault();

    // const [[, post]] = Array.from(new FormData(e.target));
    const post = Object.fromEntries(this._formData(e.target));

    if (!["post", "comment", "reply"].some((key) => post[key]?.trim()))
      return this.alert(...Object.keys(post), "error");

    const status = this._statusHandler(post);

    if (post.post) {
      e.target.insertAdjacentElement("afterend", status);

      Array.from(e.target.children).forEach((domEl) => {
        if (["post", "comment"].includes(domEl.name)) domEl.value = "";
      });
    }

    if (post.comment) {
      e.target.parentNode.nextElementSibling.insertAdjacentElement(
        "afterbegin",
        status
      );
      e.target.closest("#com-ply").remove();
    }

    if (post.reply) {
      e.target.closest("#com-ply").remove();
      this.logger(status.reply);
      return;
    }

    this._removeAnimation(".topMarginAnimation", 500);
  }

  clickHandler(e) {
    this._popUp = document.querySelector(".status-popup");
    this.#deleteBox = document.querySelector(".delete-box");
    this.#panel = document.querySelector("#panel");

    this.#deleteBoxE = e.target.closest(".delete-box");
    this.#popUpEvent = e.target.closest(".status-popup");
    this.#more = e.target.closest(".status-more");
    this.#statusBox = e.target.closest(".status-box");
    this.#cancel = e.target.closest(".cancel");
    this.#deleteStatus = e.target.closest(".delete");

    this.#statusContent = e.target.closest(".status-content");
    this.#panelE = e.target.closest("#panel");

    if (
      !(
        this.#more ||
        this._popUp ||
        this.#cancel ||
        this.#deleteStatus ||
        this.#deleteBox ||
        e.target.closest(".status-comment") ||
        e.target.closest(".reply") ||
        (document.querySelector("#com-ply") && !e.target.closest("#com-ply"))
      )
    )
      return;

    e.preventDefault();

    this.comPly(e);

    this.moreOption();

    let [share, edit, deleteOption, privacy, report] =
      this.popUpOptions() || [];

    this.deleteBoxCancel();

    this.deleteBoxDelete(e);

    this.deleteOpt(e, deleteOption);

    e.target.closest("." + share) && this._popUp.remove();
  }

  clearEmptyTextArea(e) {
    ["#reply", "#comment"].some((id, i, arr) =>
      document.querySelectorAll(id)?.forEach((el) => {
        if (el.value.trim() === "" && arr[i] === "#reply")
          el.parentNode.remove();
        if (el.value.trim() === "" && arr[i] === "#comment" && !this.#statusBox)
          el.parentNode.remove();
      })
    );
    this.logger("clearEmptyTextArea ran");
  }

  focusTextArea(e) {
    document.querySelector("#comment")?.focus();

    document
      .querySelectorAll("#reply")
      ?.forEach(
        (el) =>
          el.closest(".comment") ===
            e.target.closest(".reply").parentNode.parentNode && el?.focus()
      );
  }

  comPly(e) {
    if (
      !(
        e.target.closest(".status-comment") ||
        e.target.closest(".reply") ||
        document.querySelectorAll("#reply").length ||
        document.querySelectorAll("#comment").length
      )
    )
      return;

    this.clearEmptyTextArea(e);

    if (e.target.closest(".status-comment") && e.target.closest("#section-3"))
      return setTimeout(() => location.assign("/panel.html"), 200);

    !document.querySelector("#comment") &&
      this.#statusBox?.insertAdjacentHTML("afterbegin", this._comPlyForm());

    e.target
      .closest(".reply")
      ?.parentNode.insertAdjacentHTML("beforebegin", this._comPlyForm("reply"));

    this.focusTextArea(e);
  }

  moreOption() {
    if (!this.#more) return;

    this.#statusBox?.insertAdjacentHTML(
      "afterend",
      this.#panelE
        ? this.#btnMore.replace("scaleAnimation", "scaleyAnimation")
        : this.#btnMore
    );
  }

  popUpOptions() {
    if (!this._popUp) return;

    return !this.#popUpEvent
      ? this._popUp.remove()
      : this.#popUpEvent
      ? Array.from(this._popUp.children).map((obj) => obj.classList.value)
      : null;
  }

  deleteOpt(e, deleteOption) {
    if (!e.target.closest("." + deleteOption)) return;

    this._popUp.insertAdjacentHTML("afterend", this.#deleteBoxTemplate);

    this.#temp[0] = this._popUp.previousElementSibling;

    this.#temp[0].remove();
    this._popUp.remove();
  }

  deleteBoxCancel() {
    if (!(this.#cancel || (this.#deleteBox && !this.#deleteBoxE))) return;

    this.#temp[0]?.classList.add("scaleAnimation");

    this.#deleteBox?.insertAdjacentElement("beforebegin", this.#temp[0]);
    this.#deleteBox?.remove();

    this._removeAnimation(".scaleAnimation", 210);
    this.#temp[0] = undefined;
  }

  deleteBoxDelete(e) {
    if (!this.#deleteStatus) return;

    if (e.target.closest(".comment")) {
      e.target.closest(".comment").remove();
      return;
    }

    if (this.#panelE) {
      this.#panelE.remove();
      setTimeout(() => location.assign("/index.html"), 500);
      return;
    }

    this.#temp[0] = undefined;
    this.#deleteBox?.remove();
  }

  alert(key, c) {
    this.#root.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert"><p class="${c}"><span>Failed:</span><span>${key} cannot be empty, please try again.</span></p></div>`
    );
    setTimeout(() => document.querySelector(".alert")?.remove(), 800);
  }

  logger(key = "running") {
    this.#root.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert"><p class="success"><span style="text-decoration:underline wavy">Success:</span><span>${key}</span></p></div>`
    );
    setTimeout(() => document.querySelector(".alert")?.remove(), 1000);
  }

  secObserver() {
    return new IntersectionObserver(this.secCb);
  }

  navObserver() {
    return new IntersectionObserver(this.navCb, {
      root: null,
      rootMargin: "-40px",
      threshold: 1.0
    });
  }

  secCb(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target.parentNode;
      const navHeight = section.previousElementSibling.getBoundingClientRect()
        .height;
      const sectionPad = Number.parseFloat(
        getComputedStyle(section).marginTop,
        10
      );

      entry.target.style.position = "sticky";
      entry.target.style.top = sectionPad + navHeight + "px";
    });
  }

  navCb(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting)
        entry.target.closest(
          "section"
        ).previousElementSibling.style.backgroundColor = "rgb(17, 34, 34)";
      if (entry.isIntersecting)
        entry.target.closest(
          "section"
        ).previousElementSibling.style.backgroundColor = "rgb(17, 34, 34,.0)";

      //entry.target.closest("section").previousElementSibling.style.position = "sticky";
      //entry.target.closest("section").previousElementSibling.style.top = 0;
    });
  }
}

export default new FollowUI();
