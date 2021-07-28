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
            <a class="delete" href="#">delete</a>
            <a class="cancel" href="#">cancel</a>
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

    ["click", "submit" /*, "mousemove", "mousedown"*/].some((type, i, arr) => {
      this.#root.addEventListener(type, this.rootHandler.bind(this, arr));
    });

    document
      .querySelectorAll(".sub-nav-section")
      ?.forEach((s) => !s.classList.contains("overview") && s.remove());

    this.focusTextArea();

    this.#secs?.forEach((s) => this.secObserver().observe(s));

    document.querySelector("#post-form") &&
      this.navObserver().observe(document.querySelector("#post-form"));
    document.querySelector("#panel") &&
      this.navObserver().observe(document.querySelector(".status-box"));
  }

  rootHandler(arr, e) {
    e.type === arr[0]
      ? this.clickHandler(e)
      : e.type === arr[1]
      ? this.submitForm(e)
      : e.type === arr[2]
      ? this.shift(e)
      : e.type === arr[3]
      ? this.down(e)
      : alert("event not handled!");
  }
  x;

  down(e) {
    document.querySelector(".unshift") &&
      setTimeout(
        () => document.querySelector(".unshift")?.classList.remove("unshift"),
        401
      );

    if (!e.target.closest(".status-box ")) return;

    if (document.querySelector(".shift")) {
      document.querySelector(".shift").classList.add("unshift");
      document.querySelector(".shift").classList.remove("shift");
    }

    this.x = e.clientX;
  }

  shift(e) {
    if (
      !e.target.closest(".status-box ") ||
      !e.target.closest("#section-3") ||
      this.x === undefined
    )
      return;

    if (e.clientX - this.x < -200) {
      e.target.closest(".status-box ").classList.add("shift");
      this.x = undefined;
    }
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
    console.log(e.target.closest("button"));
    if (e.target.closest(".sub-nav-label")) {
      document
        .querySelector(".active-sub-nav-label")
        ?.classList.toggle("active-sub-nav-label");
      document
        .querySelector(
          `label[for=${e.target.closest(".sub-nav-label").getAttribute("for")}]`
        )
        ?.classList.add("active-sub-nav-label");
    }

    e.target.closest('input[name = "sub-nav-radio"]') &&
      document.querySelector(".sub-nav-section")?.remove();

    e.target
      .closest("input[name = 'sub-nav-radio']#about")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section about">about</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#friends")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section friends">friends</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#group")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section group">group</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#overview")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section overview active-sub-nav-label">${"overview"}</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#photos")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section photos">photos</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#activities")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section photos">activites</section>`
      );

    e.target
      .closest("input[name = 'sub-nav-radio']#more")
      ?.insertAdjacentHTML(
        "afterend",
        `<section class="sub-nav-section more">more</section>`
      );

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

    if (e.target.closest(".nav")) return;

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
    return new IntersectionObserver(this.secCb, {
      root: null,
      rootMargin: -this.#nav.getBoundingClientRect().height + "px",
      //
      threshold: 0
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

  navObserver() {
    return new IntersectionObserver(this.navCb.bind(this), {
      root: null,
      rootMargin: -this.#nav.getBoundingClientRect().height + "px",
      //
      threshold: 1
    });
  }

  navCb(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) this.#nav.classList.remove("stick");

      if (!entry.isIntersecting) this.#nav.classList.add("stick");
    });
  }
}

export default new FollowUI();
