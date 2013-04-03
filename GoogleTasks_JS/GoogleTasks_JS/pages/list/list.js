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

            listview.winControl.addEventListener("click", listClick, false);
            listview.winControl.addEventListener("iteminvoked", function (e) {
                e.detail.itemPromise.done(
                    function (item) {
                        listview.winControl.itemInvoked = item;
                    });
            }, false);

            function listClick(e) {
                var obj = e.srcElement;
                if (obj.localName == "input") {
                    obj = obj.parentNode;
                }

                if (WinJS.Utilities.hasClass(obj, "todolist")) {
                    var item = listview.winControl.itemInvoked;
                    var children = WinJS.Utilities.children(obj);
                    var chkBox;

                    for (var i in children) {
                        var child = children[i];
                        if (WinJS.Utilities.hasClass(child, "chkBox")) {
                            chkBox = child;
                            break;
                        }
                    }

                    if (item.data.checked) {
                        chkBox.checked = false;
                        item.data.checked = false;
                        WinJS.Utilities.removeClass(obj, "completed");
                    }
                    else {
                        chkBox.checked = true;
                        item.data.checked = true;
                        WinJS.Utilities.addClass(obj, "completed");
                    }

                    api.ClickTask(item);

                }
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
