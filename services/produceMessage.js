const express = require("express");
const amqp = require("amqplib");

var assert = require("assert");
var util = require("util");
var rabbit_user = "student";
var rabbit_pwd = "student123";
var rabbit_host = "studentdocker.informatika.uni-mb.si";
var rabbit_port = "5672";
var vhost = "";

async function produceMessage(message) {
  var amqp_url = util.format(
    "amqp://%s:%s@%s:%s/%s",
    rabbit_user,
    rabbit_pwd,
    rabbit_host,
    rabbit_port,
    vhost
  );
  var conn = await amqp.connect(amqp_url, "heartbeat=60");
  var ch = await conn.createChannel();
  var exch = "IIR-5";
  var q = "IIR-5-Logging";
  var rkey = "whyarewestillhere";
  await ch
    .assertExchange(exch, "direct", { durable: true })
    .catch(console.error);
  await ch.assertQueue(q, { durable: true });
  await ch.bindQueue(q, exch, rkey);
  await ch.publish(exch, rkey, Buffer.from(message));
  setTimeout(function () {
    ch.close();
    conn.close();
    console.log("Producing completed");
  }, 500);
}

module.exports = { produceMessage };
