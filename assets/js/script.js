document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector('#menu-icon input');
    const navContainer = document.getElementById('nav-container');
    const header = document.header;
    menuIcon.addEventListener('change', function () {
        if (menuIcon.checked) {
            navContainer.classList.add('active');
            header.classList.add('menu-open');
        } else {
            navContainer.classList.remove('active');
            header.classList.remove('menu-open');
        }
    });
    const radioInputs = document.querySelectorAll(".radio-inputs .radio");
    const sections = document.querySelectorAll("section.content");
    const docTabs = document.querySelectorAll(".doc-tab");
    const docContents = document.querySelectorAll(".doc-content");
    const prevButton = document.querySelector(".prev-article");
    const nextButton = document.querySelector(".next-article");
    const onThisPageList = document.querySelector(".on-this-page ul");
    const articles = ["getting-started", "quick-start","article-1", 
    "article-2", "article-3","changelog","advanced-usage",];
    let currentTab = "getting-started";
    let currentArticleIndex = -1;
// Function to show a specific section
function showSection(sectionId) {
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });

    // Update radio buttons
    radioInputs.forEach(label => {
        const sectionName = label.getAttribute("data-section");
        label.querySelector("input").checked = sectionName === sectionId;
    });
}
    // Handle section switching via hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const [section, subTab] = hash.includes("/") ? hash.split("/") : [hash, "getting-started"];

        // Show the correct main section
        sections.forEach(sectionEl => {
            sectionEl.style.display = sectionEl.id === section ? "block" : "none";
        });
        showSection(section || "home"); // Default to "home" if no hash is present

        // Update radio buttons
        radioInputs.forEach(label => {
            const sectionName = label.getAttribute("data-section");
            label.querySelector("input").checked = sectionName === section;
        });

        // If it's the documentation, switch to the correct tab
        if (section === "doc") {
            showContent(subTab);
            activateDocTab(subTab); // Activate the correct doc tab
        }
    }

   // Modify the activateDocTab function to handle dropdown activation and opening
function activateDocTab(tabId) {
    const tab = document.querySelector(`.doc-tab[data-tab="${tabId}"]`);
    if (tab) {
        setActiveTab(tab);
            if (tab.classList.contains("has-dropdown")) {
                tab.classList.add("open");
                toggleDropdownContent(tab);
                toggleDropdownIcon(tab);
            }
    } else {
        // If the tab is an article inside a dropdown, activate and open the parent dropdown tab
        const parentTab = document.querySelector(`.doc-tab.has-dropdown`);
        if (parentTab) {
            setActiveTab(parentTab);
            toggleDropdownIcon(parentTab);
            toggleDropdownContent(parentTab);

            // Activate the corresponding dropdown item
            const dropdownItem = document.querySelector(`.dropdown-content a[href="/${tabId}"]`);
            if (dropdownItem) {
                dropdownItem.parentElement.classList.add("active");
            }
        }
    }
}

// In the showContent function, ensure to automatically open the dropdown if the current content is inside it
function showContent(tabId) {
    docContents.forEach(content => content.style.display = "none");
    const targetContent = document.getElementById(tabId);

    if (targetContent) {
        targetContent.style.display = "block";
        currentTab = tabId;
        updateBreadcrumbs(tabId);
        updateOnThisPage(targetContent);
        updateNavigationButtons();
        updateProgressReader(targetContent);

        // Automatically activate and open the parent dropdown tab if the current tab is a dropdown article
        const parentTab = document.querySelector(`.doc-tab.has-dropdown`);
        if (parentTab && articles.includes(tabId)) {
            setActiveTab(parentTab);
            toggleDropdownIcon(parentTab);
            toggleDropdownContent(parentTab);
        }
    }
}
    // Handle navigation clicks
    radioInputs.forEach(label => {
        label.addEventListener("click", () => {
            window.location.hash = label.getAttribute("data-section");
        });
    });

    // Documentation Tab Handling
    docTabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = tab.getAttribute("data-tab");

            if (tab.classList.contains("has-dropdown")) {
                // Toggle the open class to show or hide the dropdown
                tab.classList.toggle("open");
                 toggleDropdownContent(tab); // Toggle the visibility of the dropdown content
                toggleDropdownIcon(tab); // Toggle the icon from "+" to "−"
            } else {
                // Handle regular tabs
                setActiveTab(tab);
                showContent(tabId);
                window.location.hash = `doc/${tabId}`;
            }
        });
    });

    // Dropdown item clicks
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = link.getAttribute("href").substring(1);
            showContent(tabId);
            window.location.hash = `doc/${tabId}`;

            // Highlight the active dropdown article
            const parentTab = link.closest(".doc-tab.has-dropdown");
            if (parentTab) {
                setActiveTab(parentTab);
                toggleDropdownIcon(parentTab);
            }

            // Remove active class from all dropdown items
            document.querySelectorAll(".dropdown-content li").forEach(item => {
                item.classList.remove("active");
            });

            // Add active class to the clicked dropdown item
            link.parentElement.classList.add("active");
        });
    });

    // Utility function to set the active tab
    function setActiveTab(selectedTab) {
        docTabs.forEach(tab => tab.classList.remove("active"));
        selectedTab.classList.add("active");
    }


    // Update breadcrumbs
    function updateBreadcrumbs(tabId) {
        const breadcrumbs = document.querySelector(".breadcrumbs span");
        const tab = document.querySelector(`.doc-tab[data-tab="${tabId}"]`);
        if (tab) {
            breadcrumbs.textContent = tab.textContent.trim();
        }
    }

// Function to toggle the dropdown content visibility (open/close)
function toggleDropdownContent(tab) {
    const dropdownContent = tab.querySelector(".dropdown-content");
    if (dropdownContent) {
        // Toggle max-height to open or close the dropdown content
        if (tab.classList.contains("open")) {
            dropdownContent.style.maxHeight = "200px"; // Or any value that suits your design
        } else {
            dropdownContent.style.maxHeight = "0";
        }
    }
}

// Function to toggle the dropdown icon (from "+" to "−" when open)
function toggleDropdownIcon(tab) {
    const icon = tab.querySelector(".dropdown-icon");
    if (tab.classList.contains("open")) {
        icon.textContent = "−"; // Minus symbol when expanded
    } else {
        icon.textContent = "+"; // Plus symbol when collapsed
    }
    // Ensure the dropdown icon is visible
    icon.style.display = "inline-block"; // Make sure the icon is visible when inside dropdown
}

    // Initialize dropdown icons with `+`
    document.querySelectorAll(".doc-tab.has-dropdown .dropdown-icon").forEach(icon => {
        icon.textContent = "+"; // Set initial state
    });

    // Update "On This Page"
    function updateOnThisPage(content) {
        onThisPageList.innerHTML = "";
        const headings = content.querySelectorAll("h1, h2, h3");

        headings.forEach(heading => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = heading.textContent;
            span.addEventListener("click", () => {
                heading.scrollIntoView({ behavior: "smooth" });
                heading.classList.add("highlight");
                setTimeout(() => heading.classList.remove("highlight"), 5000);
            });
            li.appendChild(span);
            onThisPageList.appendChild(li);
        });
    }

    // Update next/previous buttons
    function updateNavigationButtons() {
        currentArticleIndex = articles.indexOf(currentTab);
        prevButton.disabled = currentArticleIndex <= 0;
        nextButton.disabled = currentArticleIndex >= articles.length - 1;

        // Hide buttons if there are no more articles to navigate to
        prevButton.style.display = currentArticleIndex <= 0 ? "none" : "block";
        nextButton.style.display = currentArticleIndex >= articles.length - 1 ? "none" : "block";
    }

    // Handle previous/next buttons
    prevButton.addEventListener("click", () => {
        if (currentArticleIndex > 0) {
            const prevTab = articles[currentArticleIndex - 1];
            showContent(prevTab);
            window.location.hash = `doc/${prevTab}`;
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentArticleIndex < articles.length - 1) {
            const nextTab = articles[currentArticleIndex + 1];
            showContent(nextTab);
            window.location.hash = `doc/${nextTab}`;
        }
    });
    const backToTopButton = document.getElementById("back-to-top");
    const progressBar = document.querySelector(".progress-reader");
    
    // Show/hide the back-to-top button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("visible"); // Button becomes visible
        } else {
            backToTopButton.classList.remove("visible"); // Button hides
        }
        
        // Progress Reader Update (inside the scroll event listener for performance)
        if (progressBar) {
            const contentHeight = document.body.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (contentHeight - viewportHeight)) * 100;
            progressBar.style.width = `${progress}%`; // Adjust the width based on scroll
        }
    });
  
    // Scroll to the top of the page when the "Back to Top" button is clicked
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Smooth scroll to top
        });
    });

    // Ensure progress bar visibility (optional)
    progressBar.style.display = 'block'; // If you want it to be visible by default
  // Progress Reader
  function updateProgressReader(content) {
    const progressBar = document.querySelector(".progress-reader");
    if (!progressBar) return;

    const contentHeight = content.scrollHeight;
    const viewportHeight = window.innerHeight;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const progress = (scrollTop / (contentHeight - viewportHeight)) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

    // DARK MODE - Handle Theme Toggle and LocalStorage
    const body = document.body;
    const themeToggleCheckbox = document.getElementById("theme");
    const themeToggleLabel = document.querySelector('label[for="theme"]');
    const THEME_KEY = "theme";

    // Load Theme from LocalStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === "dark") {
            body.classList.add("dark-mode");
            themeToggleCheckbox.checked = true;
        } else {
            body.classList.remove("dark-mode");
            themeToggleCheckbox.checked = false;
        }
    }

    // Toggle Theme and Save to LocalStorage
    function toggleTheme() {
        const isDarkMode = body.classList.toggle("dark-mode");
        themeToggleCheckbox.checked = isDarkMode;
        localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
    }

    // Handle Theme Toggle on Label Click
    themeToggleLabel.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default behavior of label (focus)
        toggleTheme();
    });

    // Prevent Full Screen Overlay Blocking Clicks
    const themeFill = document.querySelector(".theme__fill");
    if (themeFill) {
        themeFill.style.pointerEvents = "none"; // Prevent blocking
    }

    // Initialize Theme on Load
    loadTheme();

    // Initialize with the correct section
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
});
