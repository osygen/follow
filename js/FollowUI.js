import Factory from "./Factory.js";

class FollowUI extends Factory {
  #deleteBox;
  #popUpEvent;
  #more;
  #statusBox;
  #temp;
  #cancel;
  #deleteStatus;
  #deleteBoxE;
  #root = document.documentElement;
  #form = document.querySelector("form");
  #nav = document.querySelector(".nav");
  #secs = document.querySelectorAll(".sec");
  #btnMore = `
        <div class="status-popup hidden">
          <span class="share"><a href="#">share</a></span>
          <span class="edit"><a href="#">edit</a></span>
          <span class="delete"><a href="#">delete</a></span>
          <span class="privacy"><a href="#">privacy</a></span>
          <span class="report"><a href="#">report</a></span>
        </div>`;
  #deleteBoxTemplate = `
        <div class="delete-box">
          <h3>DELETE</h3>
          <p class="delete-content">you are about to delete this post, do you want to continue?</p>
          <p class="delete-dialog">
            <span class="delete"><a href="#">delete</a></span>
            <span class="cancel"><a href="#">cancel</a></span>
          </p>
        </div>`;

  constructor() {
    super();

    ["click", "submit"].some((type, i, arr) => {
      this.#root.addEventListener(type, this.rootHandler.bind(this, arr));
    });

    this.#secs?.forEach((s) => this.secObserver().observe(s));
    this.#form ? this.navObserver().observe(this.#form) : undefined;
  }

  rootHandler(arr, e) {
    e.type === arr[0] ? this.clickHandler(e) : this.submitForm(e);
  }

  submitForm(e) {
    if (!e.target.closest("#post-form")) return;
    e.preventDefault();

    // const [[, post]] = Array.from(new FormData(e.target));
    const post = Object.fromEntries(this._formData(e.target));
    if (!post.post) return;

    const status = this._statusHandler(post);

    e.target.insertAdjacentHTML("afterend", status);

    Array.from(e.target.children).forEach((domEl) =>
      ["post"].includes(domEl.name) ? (domEl.value = "") : undefined
    );

    // status?.removeEventListener("submit", cb);
  }

  clickHandler(e) {
    this._popUp = document.querySelector(".status-popup");
    this.#deleteBox = document.querySelector(".delete-box");
    this.#deleteBoxE = e.target.closest(".delete-box");
    this.#popUpEvent = e.target.closest(".status-popup");
    this.#more = e.target.closest(".status-more");
    this.#statusBox = e.target.closest(".status-box");
    this.#cancel = e.target.closest(".cancel");
    this.#deleteStatus = e.target.closest(".delete");

    if (
      !(
        this.#more ||
        this._popUp ||
        this.#cancel ||
        this.#deleteStatus ||
        this.#deleteBox
      )
    )
      return;
    // if (e.target.closest("#post-form")) return;

    e.preventDefault();

    this.moreOption();

    let [share, edit, deleteOption, privacy, report] =
      this.popUpOptions() || [];

    this.deleteBoxCancel();

    this.deleteBoxDelete();

    this.deleteOpt(e, deleteOption);

    e.target.closest("." + share) && this._popUp.remove();
  }

  moreOption() {
    if (!this.#more) return;

    this.#statusBox?.insertAdjacentHTML("afterend", this.#btnMore);
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

    this.#temp = this._popUp.previousElementSibling;
    this.#temp.remove();
    this._popUp.remove();
  }

  deleteBoxCancel() {
    if (!(this.#cancel || (this.#deleteBox && !this.#deleteBoxE))) return;

    this.#deleteBox?.insertAdjacentElement("beforebegin", this.#temp);
    this.#deleteBox?.remove();
    this.#temp = undefined;
  }

  deleteBoxDelete() {
    if (!this.#deleteStatus) return;

    this.#deleteBox?.remove();
    this.#temp = undefined;
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
