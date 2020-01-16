var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BIqnGdzcGZPRxnY7GBBDBRixW0II-G0K47_OdQU_qxsuwFW9nFbDDgeBaKWIZb7O8XoVQC0PszqC1ZRX6ezfXmQ",
    "privateKey": "88fh2kQXcITiMawObFKMD7DyyeKS__nvJooFgrvdxFc"
};
 
 
webPush.setVapidDetails(
    'mailto:kresna.putrawan@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cMgLnONV5G8:APA91bGI-ybn1jEBcjJ2uygrmSGcxkWGCwR0haBSpM89I-OJT7MqvRMQDnmZLVTYu5jZ0llsfD9Gi-dkt1tVvvqNge3OKn5xIBNeny99r_rob1riWk-3P0YBWxeUPA6yZwTWfXlyXTN8",
    "keys": {
        "p256dh": "BC86uCSokhMUMmR2/3Cmdje3BCH3Ii6Z4W2GhkNmBxW3nAg5s5cLvtBqva1b37Cv2nWJvbi/t3/T5QeuOWDAtec=",
        "auth": "4/5b+1xJH5NlhbNguHfkIA=="
    }
};
var payload = 'Bundesliga! Football as it is meant to be!';
var options = {
    gcmAPIKey: '938142055746',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);