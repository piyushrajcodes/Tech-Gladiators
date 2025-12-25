const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

const twilioClient = twilio(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

exports.appointmentReminder = functions.firestore
  .document("appointments/{appointmentId}")
  .onCreate(async (snap, context) => {
    const appointment = snap.data();

    // Send email notification
    const mailOptions = {
      from: "hfly04712@gmail.com",
      to: appointment.email,
      subject: "Appointment Reminder",
      text: `You have an appointment on ${appointment.start.toDate()}`,
    };
    await transporter.sendMail(mailOptions);

    // Send SMS notification
    await twilioClient.messages.create({
      body: `You have an appointment on ${appointment.start.toDate()}`,
      to: appointment.phone,
      from: functions.config().twilio.phone_number,
    });

    // Send in-app notification
    const payload = {
      notification: {
        title: "Appointment Reminder",
        body: `You have an appointment on ${appointment.start.toDate()}`,
      },
    };
    await admin.messaging().sendToDevice(appointment.fcmToken, payload);

    return null;
  });

exports.recognizePrescription = functions.https.onCall(async (data, context) => {
  const imageUrl = data.imageUrl;

  // TODO: Implement OCR and NLP here
  // For now, return dummy data
  return {
    medicineName: "Amoxicillin",
    uses: "Antibiotic used to treat bacterial infections.",
    dosage: "500mg, three times a day.",
    sideEffects: "Nausea, vomiting, diarrhea.",
  };
});
