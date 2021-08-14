const root = document.documentElement,
  form = document.querySelector("form"),
  nav = document.querySelector(".nav"),
  secs = document.querySelectorAll(".sec");

const btnMore = `
    <div class="status-popup hidden">
      <span class="share"><a href="#">share</a></span>
      <span class="edit"><a href="#">edit</a></span>
      <span class="delete"><a href="#">delete</a></span>
      <span class="privacy"><a href="#">privacy</a></span>
      <span class="report"><a href="#">report</a></span>
    </div>`,
  deleteBoxTemplate = `
    <div class="delete-box ">
      <h3>DELETE</h3>
      <p class="delete-content">you are about to delete this post, do you want to continue?</p>
      <p class="delete-dialog">
        <span class="delete-status"><a href="#">delete</a></span>
        <span class="cancel"><a href="#">cancel</a></span>
      </p>
    </div>`,
  statusTemplate = `
    <div class="status-box">
      <div class="status-info">
        <div class="user-image-box">
          <img src="./img/IMG_sam_3234353.jpg" alt="" class="user-image" />
        </div>
        <p>
          <span class="username">oduwole samuel</span>
          <span class="date">⏲ 22 min.</span>&nbsp;<span>📌</span>
        </p>
        <span>⭐</span>
      </div>
      <p class="status-content">{{post}}</p>
      <p class="status-content-dialog">
        <span class="status-like">
          <a href="#">likes</a>
          <span> 99+</span>
        </span>
        <span class="status-comment">
          <a href="#">comments</a>
          <span> 9</span>
        </span>
        <span class="status-more">
          <a href="#">more</a>
        </span>
      </p>
    </div>`;

function submitForm(e) {
  if (!e.target.closest("#post-form")) return;
  e.preventDefault();

  // const [[, post]] = Array.from(new FormData(e.target));
  const { post } = Object.fromEntries(new FormData(e.target));
  if (!post) return;

  const status = statusTemplate.replace("{{post}}", post);

  e.target.insertAdjacentHTML("afterend", status);

  Array.from(e.target.children).forEach((domEl) =>
    ["post"].includes(domEl.name) ? (domEl.value = "") : undefined
  );

  // status?.removeEventListener("submit", cb);
}

let temp;

function clickHandler(e) {
  const popUp = document.querySelector(".status-popup"),
    deleteBox = document.querySelector(".delete-box");
  const popUpEvent = e.target.closest(".status-popup"),
    more = e.target.closest(".status-more"),
    statusBox = e.target.closest(".status-box");

  const cancel = e.target.closest(".cancel");
  const deleteStatus = e.target.closest(".delete-status");

  let share, edit, deleteOption, privacy, report;

  if (!(popUp || more || cancel || deleteStatus || deleteBox)) return;
  e.preventDefault();

  popUp && setTimeout(() => popUp?.remove(), 50);

  if (more) {
    deleteBox?.insertAdjacentElement("beforebegin", temp);
    deleteBox?.remove();
    temp = undefined;

    setTimeout(() => statusBox?.insertAdjacentHTML("afterend", btnMore), 50);
    // more?.insertAdjacentHTML("beforebegin", btnMore);
  }

  if (cancel || (deleteBox && !e.target.closest(".delete-box"))) {
    deleteBox?.insertAdjacentElement("beforebegin", temp);
    deleteBox?.remove();
    temp = undefined;
  }

  if (deleteStatus) {
    deleteBox?.remove();
    temp = undefined;
  }

  if (popUp)
    [share, edit, deleteOption, privacy, report] = Array.from(
      popUp.children
    ).map((obj) => obj.classList.value);

  if (e.target.closest("." + deleteOption)) {
    popUp.insertAdjacentHTML("afterend", deleteBoxTemplate);
    const t = popUp.previousElementSibling;
    temp = t;
    t.remove();
    popUp.remove();

    setTimeout(() => {
      document.querySelector(".delete-box").style.transform = "scale(1)";
    }, 80);
  }
}

function navCb(entries, observer) {
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

const navObserver = new IntersectionObserver(navCb, {
  root: null,
  rootMargin: "-40px",
  threshold: 1.0
});
form ? navObserver.observe(form) : null;

function secCb(entries) {
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

const secObserver = new IntersectionObserver(secCb);
secs?.forEach((s) => secObserver.observe(s));

["submit", "click"].forEach((type, i, arr) =>
  root.addEventListener(type, function (e) {
    (e.type === arr[0] && submitForm(e)) ||
      (e.type === arr[1] && clickHandler(e));
  })
);
