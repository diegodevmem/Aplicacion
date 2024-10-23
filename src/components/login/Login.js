import auth from "../../auth";
import FormError from "../shared/FormError";
import logo_back from "../../assets/fondo_logo.jpg";
import logo2 from "../../assets/fondo_tarde.jpg";
import logo3 from "../../assets/fondo_noche.jpg";
import logo4 from "../../assets/f4.jpg";

export default {
  name: "Login",
  components: {
    FormError,
  },

  data() {
    return {
      logo2,
      loading: false,
      valid: true,
      items: [
        {
          src: logo_back,
        },
        {
          src: logo2,
        },
        {
          src: logo3,
        },
        {
          src: logo4,
        },
      ],
      logo_back,
      isUpper: false,
      input_type: "password",
      showPasswordinput: false,

      credentials: {
        cui: "",
        password: "",
      },

      show1: false,
    };
  },

  created() {

    auth.user.sidebar = false;
    this.$toastr.info(
      "Por favor antes de usar el sistema, presiona control + F5",
      "Atención",
      {
        positionClass: "toast-top-full-width",
        progressBar: true,
        timeOut: "5000",
      }
    );
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        
        this.loading = true;

        setTimeout(() => { this.auth(); }, 100);
      }
    },

    async auth() {
      auth.login(this, this.credentials, "/panel");
      // this.loading = false;
    },

    checkCapsLock(e) {
      let self = this;
      try {
        if (e.getModifierState("CapsLock")) {
          self.isUpper = true;
        } else {
          self.isUpper = false;
        }
      } catch (error) {
        console.log(error);
      }

    },

  },

};