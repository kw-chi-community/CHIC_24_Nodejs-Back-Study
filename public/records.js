document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("card-container");

  // 서버에서 기록 데이터를 가져옴
  fetch("/api/records")
    .then((response) => response.json())
    .then((data) => {
      // 데이터를 순회하면서 카드 요소를 생성
      data.forEach((record) => {
        const card = document.createElement("div");
        card.className = "card";

        const cardImage = document.createElement("div");
        cardImage.className = "card-image";
        cardImage.style.backgroundImage = `url(${record.image})`;

        const cardTitle = document.createElement("p");
        cardTitle.className = "card-title";
        cardTitle.textContent = record.title;

        // 수정 버튼 추가
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn"; // 수정 버튼 클래스 적용
        editBtn.textContent = "수정";

        // 삭제 버튼 추가
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn"; // 삭제 버튼 클래스 적용
        deleteBtn.textContent = "삭제";

        // 카드 클릭 시 view.html로 이동
        card.addEventListener("click", () => {
          window.location.href = `view.html?id=${record.id}`;
        });

        // 수정 버튼 클릭 시 edit.html로 이동
        editBtn.addEventListener("click", (event) => {
          event.stopPropagation(); // 카드 클릭 이벤트가 실행되지 않도록 함
          window.location.href = `edit.html?id=${record.id}`;
        });

        // 삭제 버튼 클릭 시 삭제 로직 구현
        deleteBtn.addEventListener("click", (event) => {
          event.stopPropagation(); // 카드 클릭 이벤트가 실행되지 않도록 함
          const confirmDelete = window.confirm(
            `나의 회고록 '${record.title}' 을/를 삭제하시겠습니까?`
          );

          if (confirmDelete) {
            fetch(`/api/records/${record.id}`, {
              method: "DELETE",
            }).then(() => {
              card.remove();
            });
          }
        });

        // 카드 요소 조립
        card.appendChild(cardImage);
        card.appendChild(cardTitle);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        cardContainer.appendChild(card);
      });
    });
});
