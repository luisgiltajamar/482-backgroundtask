(function() {
    var instancia =
        Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var Notifications = Windows.UI.Notifications;
    var cancel = false;
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

    function cancelar(sender,reason) {
        cancel = true;

    }

    instancia.addEventListener("canceled", cancelar);

    if (!cancel)
        ejecutar();
})();