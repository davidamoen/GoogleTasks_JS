// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/list/list.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            listName.textContent = options.name;
            WinJS.Navigation.history.current.initialPlaceholder = true;

            var listview = document.getElementById('todoList');
            var todoJSON = api.GetList(options.id);

            element.querySelector("#backToMain").onclick = function (e) {
                localStorage.removeItem("currentList");
                WinJS.Navigation.back();
            }

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
