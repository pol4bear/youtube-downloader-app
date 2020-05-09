import {Dictionary} from "../common/Types"

const Messages:Dictionary<Record<string, string>> = {
    ko: require("./ko.json"),
    en: require("./en.json")
};

export default Messages;