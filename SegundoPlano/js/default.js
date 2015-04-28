// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var Notifications = Windows.UI.Notifications;
    function ejecutar() {

        var manager = Notifications.ToastNotificationManager;
        var notificacion = manager.createToastNotifier();
        var plantilla = Notifications.ToastTemplateType.toastText02;
        var xml = manager.getTemplateContent(plantilla);

        var textos = xml.getElementsByTagName("text");
        textos[0].appendChild(xml.createTextNode("Estoy en segundo plano"));
        textos[1].appendChild
            (xml.createTextNode("Controla esto si puedes ;)"));

        var toast = new Notifications.ToastNotification(xml);
        notificacion.show(toast);

    }

    function registrarTarea() {

        var builder = new Windows.ApplicationModel.Background.
            BackgroundTaskBuilder();

        var trigger = new Windows.ApplicationModel.
            Background.SystemTrigger(Windows.ApplicationModel.
                Background.SystemTriggerType.networkStateChange,false);//TimeTrigger(15, false);
        builder.name = "Mi tarea de demo";
        builder.taskEntryPoint = "js\\tareaSegundoPlano.js";
        builder.setTrigger(trigger);
        builder.register();

    }


    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });
            registrarTarea();
            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
