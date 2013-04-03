(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            
            if (!isAuthorized) {
                if (localStorage.getItem("authInfo")) {
                    api.Refresh();
                }
                else {
                    api.Authorize();
                }
            }

            //localStorage.removeItem("currentList");
            var listview = document.getElementById('allLists');
            listview.winControl.addEventListener("click", listClick, false);
            listview.winControl.addEventListener("iteminvoked", function (e) {
                e.detail.itemPromise.done(
                    function (item) {
                        listview.winControl.itemInvoked = item;
                    });
            }, false);

            function listClick(e) {

                if (WinJS.Utilities.hasClass(e.srcElement, "todolist")) {
                    var item = listview.winControl.itemInvoked;
                    localStorage.setItem("currentList", JSON.stringify(item));
                    WinJS.Navigation.navigate("/pages/list/list.html", { id: item.data.id, name: item.data.title, link: item.data.selfLink });
                }
            }
        }
    });
})();

var api = new API();
var isAuthorized = false;