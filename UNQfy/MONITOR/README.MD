Monitoreo y aviso en Discord.

Este servicio sirve para saber si UNQfy, el servicio de newsletter y el servicio de logging están funcionando o no. Informa en discord si alguno de los servicios ha dejado de funcionar. De esta manera el equipo de desarrollo puede monitorear la actividad de UNQfy con comodidad.

El monitor chequea periódicamente el estado de los servicios y notifica vía discord en caso de falla de alguno de los mismos. También notifica si el servicio volvió a la normalidad,

Los mensajes tienen la forma:
"[HORA DEL INCIDENTE] El servicio X ha dejado de funcionar"
"[HORA DEL INCIDENTE] El servicio X ha vuelto a la normalidad"

URL en discord la cual deberá enviar request POST al Endpoint documentado en https://discord.com/developers/docs/resources/webhook#execute-webhook.


A continuación se muestra un un ejemplo mínimo utilizando curl:

curl -X POST -H 'Content-type: application/json' --data '{"content":"[HORA DEL INCIDENTE] El servicio X ha dejado de funcionar"}' https://discord.com/api/webhooks/862705963345772576/kFXRW-oe5jbe3Vj3tQy3mxs_78lo5ER-7vCLrs6CVpef5pWRtsvHVk_mB6K-XZ1fOiIG


El servicio permite saber el estado de los servicios. Es decir, si se envía un request este responde si los servicios se encuentran activos o no.

Monitorea periódicamente el estado de los servicios y notifica a discord en caso de falla de alguno de los mismos.

Se puede desactivar/activar el monitoreo periódico.


IMPORTANTE: NO SUBA SU APIKEY DE DISCORD AL REPOSITORIO GIT
