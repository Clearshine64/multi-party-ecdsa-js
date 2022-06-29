const express = require("express");
const cors = require("cors");
const path = require('path');
const bindings  = require(path.join(__dirname, '../../../native'));
const {BigInt, EncryptionKey, FE, FE_BYTES_SIZE, GE, stringifyHex} = require('../common');
const util = require('util');

bindings.p2_ecdsa_generate_master_key = util.promisify(bindings.p2_ecdsa_generate_master_key);
bindings.p2_ecdsa_sign = util.promisify(bindings.p2_ecdsa_sign);

const {curve, EC} = require('elliptic');

const CURVE = "secp256k1";
const ec = new EC(CURVE);

const app = express();
const PORT = process.env.PORT || 8000;
const router = express.Router();

router.get("/", function (req, res) {
    res.send("Hello world!");
});

const room_id = 1;

let url = "/rooms/" + room_id + "/subscribe";
router.get(url, function (req, res) {
    const res = JSON.parse(await bindings.p2_ecdsa_sign(
        this.party1Endpoint,
        JSON.stringify(msgHash.toString('hex')),
        JSON.stringify(childPartyTwoShare),
        stringifyHex(xPos),
        stringifyHex(yPos)));

    return EcdsaSignature.fromPlain(res);

});

url = "/rooms/" + room_id + "/issue_unique_idx";

router.get(url, function (req, res) {
    const res = JSON.parse(bindings.p2_ecdsa_get_child_share(
        JSON.stringify(p2MasterKeyShare),
        stringifyHex(xPos),
        stringifyHex(yPos)));
    return EcdsaParty2Share.fromPlain(res);
});

url = "/rooms/" + room_id + "/broadcast";

router.get(url, function (req, res) {
    const res = JSON.parse(await bindings.p2_ecdsa_generate_master_key(this.party1Endpoint));
    return EcdsaParty2Share.fromPlain(res);
});
