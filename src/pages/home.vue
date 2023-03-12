<template>
  <div :class="$style.main">
    <form v-if="stage !== 'submitted'" :class="$style.main_content" @submit="handleSubmit">
      <!-- PHONE -->
      <template v-if="stage === 'phone'">
        <div :class="$style.main_seen" />
        <div :class="$style.main_phone">
          <!--vmodel="formData['entry.585072154']"-->
          <input
            placeholder="phone number"
            name="number"
            autocomplete="off"
            :class="$style.main_input"
            :value="formData['entry.585072154']"
            @input="handlePhone"
            @keypress="handleKeyPress"
            required
          />
          <p :class="$style.main_phone_text">
            By entering your phone number and submitting this form, you confirm that you are 13+ years old and consent
            to receive marketing texts. Msg & data rates may apply. Msg frequency varies. Reply STOP to cancel.
          </p>
          <!-- <p :class="$style.main_phone_text">
            Our lawyers told us to we needed this -> By entering your phone number and submitting this form, you
            consent to receive marketing text messages from Seen. Consent is not a condition of any purchase. Message
            and data rates may apply. Message frequency varies. You can unsubscribe at any time by replying STOP or
            clicking the unsubscribe link (where available) in one of our messages.
          </p>
          <p :class="$style.main_phone_subtext">
            I confirm that I am 13+ years old & agree to receive marketing texts at the phone number provided. Msg &
            data rates may apply. Msg frequency varies. Reply STOP to cancel.
          </p> -->
          <button type="button" :class="$style.main_submit" @click="handleNext">Submit</button>
        </div>
      </template>
      <!-- FORM -->
      <div v-if="stage === 'form'" :class="$style.main_form">
        <!--switched email and name around-->
        <input
          placeholder="Email"
          name="email"
          autocomplete="off"
          :class="$style.main_input"
          :value="formData['entry.215460964']"
          @input="handleInput('entry.215460964', $event)"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
        <input
          placeholder="Name"
          name="name"
          autocomplete="off"
          :class="$style.main_input"
          :value="formData['entry.1553671624']"
          @input="handleInput('entry.1553671624', $event)"
        />
        <input
          placeholder="Age"
          name="age"
          autocomplete="off"
          :class="$style.main_input"
          :value="formData['entry.936612896']"
          @input="handleInput('entry.936612896', $event)"
          @keypress="handleKeyPress"
        />
        <div :class="$style.main_controls">
          <div :class="$style.main_controls_item">
            <button :class="$style.main_submit" type="submit" :disabled="disabledSubmit">Next</button>
          </div>
          <div :class="$style.main_controls_item">
            <button
              :class="[$style.main_submit, $style.main_skip]"
              type="submit"
              :disabled="disabledSubmit"
              @click="handleSubmit($event, true)"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </form>
    <!-- SUBMITTED -->
    <div v-if="stage === 'submitted'" :class="$style.main_submitted">
      <!-- <h3 :class="$style.main_submitted_title">You're on the list.</h3> -->
      <p :class="$style.main_submitted_text">You're on the list.</p>
      <p :class="$style.main_submitted_text">Seen is more fun with friends</p>
      <img src="/img/shirt.png" alt="shirt" :class="$style.main_submitted_shirt" />
      <p :class="$style.main_submitted_text">
        Get early access & limited edition Seen gear by telling your friends to sign up too.
      </p>
      <p :class="$style.main_submitted_text" data-hashtag>#joinseen</p>
      <a
        :class="$style.main_submitted_link"
        href="sms:?&body=I%20just%20signed%20up%20for%20Seen%20-%20the%20new%20app%20for%20the%20closest%20people%20in%20your%20life.%20Guess%20what,%20you%20made%20the%20cut.%20%F0%9F%98%8A%F0%9F%98%8A%F0%9F%98%8A%0A%0ASign%20up%20too%20so%20that%20we%20can%20chat:%20www.seen.video"
        >text 3 friends</a
      >
    </div>
    <div :class="$style.main_socials">
      <a :class="$style.main_socials_link" target="_blank" href="https://www.instagram.com/_behindtheseens_/">
        <InstagramIcon />
      </a>
      <a :class="$style.main_socials_link" target="_blank" href="https://snapchat.com/add/behindthe_seens">
        <SnapchatIcon />
      </a>
      <a :class="$style.main_socials_link" target="_blank" href="https://www.tiktok.com/@behindtheseens_">
        <TiktokIcon />
      </a>
    </div>
    <div :class="$style.main_links">
      <RouterLink to="/terms" :class="$style.main_links_item">terms</RouterLink>
      <a href="mailto:team@seen.video" target="_blank" :class="$style.main_links_item">contact</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import axios, { AxiosError } from "axios";
import { RouterLink } from "vue-router";
import InstagramIcon from "components/icons/instagram.icon.vue";
import TiktokIcon from "components/icons/tiktok.icon.vue";
import SnapchatIcon from "components/icons/snapchat.icon.vue";
//import { VueTelInput } from "vue3-tel-input";
//import "vue3-tel-input/dist/vue3-tel-input.css";

const apiURL = 'http://localhost:8000/api/'

interface Inputs {
  "entry.585072154": string; // phone
  "entry.1553671624": string; // name
  "entry.936612896": string; // age
  "entry.215460964": string; // email
}
const formData = ref<Record<string, string>>({
  "entry.936612896": "",
  "entry.215460964": "",
  "entry.585072154": "",
  "entry.1553671624": "",
});
const computedPhone = computed<string>(() => formData.value["entry.585072154"].trim());
const handleInput = function <T extends keyof Inputs>(key: T, e: Event) {
  const target = e.target as HTMLInputElement;
  formData.value[key] = target.value;
};
const handlePhone = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let withPlus = target.value.startsWith("+") ? "+" : "";
  let formattedValue = target.value.replaceAll(/\D/g, "");
  formData.value["entry.585072154"] = target.value = `${withPlus}${
    formattedValue === "" ? formattedValue.toString() : formattedValue
  }`;
};
const handleNext = async function () {
  if (computedPhone.value !== "") {
    try {
      //check to see if phone number is already in database
      console.log("hi")
      const response = await axios.get(apiURL + 'check_email_verification/'+ computedPhone.value, {withCredentials: true});
      //if phone number is in database, check email_verified
      const account = response.data;
      console.log(account);
      if (account.email_verified){
        //if verified, then we move on to profile page
        disabledSubmit.value = false;
        stage.value = "submitted";
      }
      else{//if not, we redirect them to fill in other details
        await axios.post(apiURL + 'save_account/', JSON.stringify(formData.value),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        stage.value = "form";
      }
    } catch (error: any) {
      if (error.response.status === 404){
        await axios.post(apiURL + 'save_account/', JSON.stringify(formData.value),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        stage.value = "form";
      }
      else {
        console.log(error);
    }
  }
  }
  
};
const stage = ref<"phone" | "form" | "submitted">("phone");
const disabledSubmit = ref(false);

async function handleSubmit(ev: Event, skip: boolean = false) {
  ev.preventDefault();
  if (computedPhone.value !== "") {
    try {
      //new FormData()
      const patchData: {[key: string]: string}= {};
      for (let prop in formData.value) {
        if (skip && prop !== "entry.585072154") continue;
        let value = formData.value[prop].trim();
        patchData[prop] = value;
        disabledSubmit.value = true;
      }
      //come back to this later for updating the account
      await axios.patch(apiURL + 'update_account/', JSON.stringify(patchData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } finally {
      disabledSubmit.value = false;
      stage.value = "submitted";
    }
  }
}

function handleKeyPress(ev: KeyboardEvent) {
  let target = ev.target as HTMLInputElement;
  let keyCode = ev.keyCode ? ev.keyCode : ev.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 43) {
    ev.preventDefault();
  }
  if (keyCode === 43 && target.value.toString() === "0") {
    target.value = `+`;
  }
}
</script>

<style module lang="scss">
.main {
  width: 100%;
  flex-grow: 1;
  /* background: #F783EF; */
  display: flex;
  flex-direction: column;
  position: relative;
}
.main_content {
  padding-top: 50px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main_seen {
  width: 722px;
  height: 208px;
  background: transparent;
  background-image: url("/img/sprite-722x208.png");
  background-size: 200% 400%;
  background-repeat: no-repeat;
  background-position: 0 0;
  animation: switchSprite 3s infinite;
}

:global(body.webp) {
  .main_seen {
    background-image: url("/img/sprite-722x208.webp");
  }
}
.main_input {
  padding: 15px;
  border: 3px solid $clr-yellow;
  border-radius: 35px;
  flex-grow: 1;
  text-align: center;
  font: 400 24px/1.25 $baseMono;
  color: #fff;
  width: 100%;
  text-transform: lowercase;
  &::placeholder {
    color: $clr-yellow;
    font-style: italic;
  }
}
.main_form {
  padding-top: 80px;
  max-width: 540px;
  padding-inline: 20px;
  width: 100%;
  margin-inline: auto;

  .main_input {
    background: #272727;
    border: none;
    &,
    &::placeholder {
      color: #f783ef;
    }
  }
  .main_input + .main_input {
    margin-top: 26px;
  }
}
.main_submit {
  max-width: 100%;
  width: 100%;
  background: $clr-yellow;
  padding: 15px 25px;
  border-radius: 35px;
  font: 400 22px/1.25 $baseMono;
  color: #272727;
  text-transform: lowercase;
  transition: opacity 0.2s ease-out;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.main_skip {
  margin-top: 10px;
  background: transparent;
  font-weight: 300;
}
.main_controls {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* justify-content: space-between; */

  /* &_item {
    flex: 0 0 calc(50% - 8px);
  } */

  &_item {
    max-width: 50%;
    width: 250px;
    margin: 0 auto;
  }
}
.main_phone {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  max-width: 540px;
  width: 100%;
  margin-inline: auto;

  .main_input {
    border-color: #272727;
    &::placeholder {
      font-size: 26px;
      color: #272727;
    }
  }
  .main_submit {
    margin: 8px auto 0;
    max-width: 150px;
    /* background-color: #272727; */
    color: #f783ef;
  }
}
.main_phone_text {
  margin-top: 20px;
  text-align: center;
  font: 300 11px/1.1 $baseMono;
  color: $clr-yellow;
}
.main_phone_subtext {
  text-align: center;
  font: 400 13px/1.1 $baseMono;
  margin-top: 15px;
  color: $clr-yellow;
}
.main_socials {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  &_link {
    margin-inline: 8px;
    width: 43px;
    padding: 3px;
    [data-fill] {
      fill: $clr-yellow;
    }
  }
}

.main_links {
  padding-bottom: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  &_item {
    font: 700 18px/1.25 $baseMono;
    color: #272727;
  }

  &_item + &_item {
    margin-left: 25px;
  }
}

.main_submitted {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 500px;
  width: 100%;
  margin: auto;
  padding-inline: 20px;

  text-align: center;

  &_title {
    font: 400 16px/1.25 $baseMono;
    color: #fff;
  }
  &_shirt {
    max-width: 250px;
  }
  &_text {
    font: 300 19px/1.25 $baseMono;
    color: #000;

    &[data-hashtag] {
      color: $clr-yellow;
    }
  }
  &_text + &_text {
    margin-top: 6px;
  }
  &_link {
    margin-top: 25px;
    max-width: 250px;
    width: 100%;
    background: $clr-yellow;
    padding: 15px 25px;
    border-radius: 35px;
    font: 400 18px/1.25 $baseMono;
    color: #272727;
    text-transform: lowercase;
    transition: opacity 0.2s ease-out;
  }
}

.main_timer {
  margin-top: 50px;
  font: 400 18px/1.25 $baseMono;
  color: $clr-yellow;
  text-align: center;
}

@media (max-width: $laptop_big) {
  .main_content {
    padding-top: 25px;
  }
  .main_seen {
    width: 577.6px;
    height: 166.4px;
  }
}

@media (max-width: $tablet_big) {
  .main_seen {
    width: 577.6px;
    height: 166.4px;
  }
  .main_phone {
    max-width: 450px;
    &_input,
    &_submit {
      padding: 14px;
      font-size: 16px;
    }
  }
}

@media (max-width: $tablet) {
  .main_seen {
    width: 440.44px;
    height: 120.16px;
  }
  .main_phone {
    /* max-width: 330px; */
    &_input,
    &_submit {
      padding: 12px;
      font-size: 16px;
    }
    /* .main_input {
      order: 1;
    }
    .main_submit {
      order: 2;
    }
    &_text {
      order: 3;
      color: #272727;
    }
    &_subtext {
      order: 4;
      color: #272727;
    } */
  }
  .main_links {
    &_item {
      font-size: 16px;
    }
    &_item + &_item {
      margin-left: 30px;
    }
  }
}

@media (max-width: $mobile) {
  .main_form {
    padding-top: 140px;
  }
  .main_skip {
    margin-top: 30px;
  }
  .main_seen {
    /* width: 288.8px; */
    width: calc(100% - 30px);
    height: auto;
    padding-bottom: 26%;
  }
  .main_content {
    /* padding-top: 80px; */
  }
  .main_phone {
    /* max-width: 290px; */
    padding-inline: 15px;

    .main_input {
      border-color: #272727;
      &::placeholder {
        color: #272727;
      }
    }
  }
  .main_controls {
    margin-top: 40px;
    flex-direction: column;
    padding-bottom: 25px;
    align-items: center;
    &_item {
      width: 100%;
    }
    &_item + &_item {
      flex: 0 0 auto;
      width: 100%;
    }
    /* &_item:last-child {
      margin-bottom: 16px;
      max-width: 60%;
    }
    &_item:first-child {
      max-width: 60%;
    } */
  }
}

@media (max-width: $mobile_small) {
  .main_form {
    padding-top: 80px;
  }
  .main_controls {
    margin-top: 30px;
  }
  .main_submitted {
    padding-block: 20px;
  }
}

@keyframes switchSprite {
  0%,
  14.29999%,
  100% {
    background-position: 0% 0%;
  }
  14.3%,
  28.59999% {
    background-position: 0 33.33333%;
  }
  28.6%,
  42.89999% {
    background-position: 0 66.66666%;
  }
  42.9%,
  57.19999% {
    background-position: 0 100%;
  }
  57.2%,
  71.49999% {
    background-position: 100% 0;
  }
  71.5%,
  85.79999% {
    background-position: 100% 33.33333%;
  }
  85.8%,
  99.99999% {
    background-position: 100% 66.66666%;
  }
}
</style>
