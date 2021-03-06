<template>
  <div>
    <h5 class="subheading text-uppercase grey--text">Calendrier</h5>

    <v-layout fill-height>
      <v-flex>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" @click="setToday">Aujourd'hui</v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>arrow_back_ios</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>arrow_forward_ios</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>arrow_drop_down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Jour</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semaine</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mois</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 jours</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            rippleCalendar
            locale="fr"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            full-width
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>favorite</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-flex>
    </v-layout>
    <!-- modal  -->
    <div id="create">
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="secondary" class="floatButton" fab dark v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title>
              <span class="headline">Ajouter un evenment</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-text-field
                      v-model="event.name"
                      :rules="eventValidation.name"
                      label="Titre d'action"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-text-field
                      v-model="event.details"
                      label="Description"
                      :rules="eventValidation.details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-text-field
                      label="Date limite"
                      :rules="eventValidation.end"
                      v-model="event.end_at"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-select
                      :items="['red', 'yellow', 'indigo', 'pink', 'purpel']"
                      v-model="event.color"
                      label="Couleur"
                      :rules="eventValidation.color"
                      required
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="reset">Fermer</v-btn>
              <v-btn color="blue darken-1" @click="submit" text
                >Enregistrer</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    //float actions button
    direction: "top",
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: "slide-y-reverse-transition",
    //search and add event
    dialog: false,
    search: "",

    //calendar data
    today: new Date().toISOString(),
    type: "month",
    focus: new Date().toISOString(),

    typeToLabel: {
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      "4day": "4 Jours"
    },
    //form add event
    valid: false,
    event: {
      name: "",
      details: "",
      start_at: "",
      end_at: "",
      color: "cyan"
    },
    eventValidation: {
      name: [
        v => !!v || "Name is required",
        v => (v && v.length >= 4) || "Name must be valid"
      ],
      details: [
        v => !!v || "Details are required",
        v => (v && v.length >= 6) || "Details must be valid"
      ],

      end: [v => !!v || "End date is required"],
      color: [v => !!v || "Color is required"]
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [
      {
        name: "Vacation",
        details: "Going to the beach!",
        start: "2018-12-29",
        end: "2019-08-09",
        color: "blue"
      },
      {
        name: "Meeting",
        details: "Spending time on how we do not have enough time",
        start: "2019-01-07 09:00",
        end: "2019-08-07 09:30",
        color: "indigo"
      },
      {
        name: "Large Event",
        details:
          "This starts in the middle of an event and spans over multiple events",
        start: "2018-08-12",
        end: "2019-08-19",
        color: "deep-purple"
      },
      {
        name: "3rd to 7th",
        details: "Testing",
        start: "2019-01-03",
        end: "2019-01-07",
        color: "cyan"
      },
      {
        name: "Big Meeting",
        details: "A very important meeting about nothing",
        start: "2019-01-07 08:00",
        end: "2019-01-07 11:30",
        color: "red"
      },
      {
        name: "Another Meeting",
        details: "Another important meeting about nothing",
        start: "2019-01-07 10:00",
        end: "2019-01-07 13:30",
        color: "brown"
      },
      {
        name: "7th to 8th",
        start: "2019-01-07",
        end: "2019-01-08",
        color: "blue"
      },
      {
        name: "Lunch",
        details: "Time to feed",
        start: "2019-01-07 12:00",
        end: "2019-01-07 15:00",
        color: "deep-orange"
      },
      {
        name: "30th Birthday",
        details: "Celebrate responsibly",
        start: "2019-01-03",
        color: "teal"
      },
      {
        name: "New Year",
        details: "Eat chocolate until you pass out",
        start: "2019-01-01",
        end: "2019-01-02",
        color: "green"
      },
      {
        name: "Conference",
        details: "The best time of my life",
        start: "2019-01-21",
        end: "2019-01-28",
        color: "grey darken-1"
      },
      {
        name: "Hackathon",
        details: "Code like there is no tommorrow",
        start: "2019-01-30 23:00",
        end: "2019-02-01 08:00",
        color: "black"
      },
      {
        name: "event 1",
        start: "2019-01-14 18:00",
        end: "2019-01-14 19:00",
        color: "#4285F4"
      },
      {
        name: "event 2",
        start: "2019-01-14 18:00",
        end: "2019-01-14 19:00",
        color: "#4285F4"
      },
      {
        name: "event 5",
        start: "2019-01-14 18:00",
        end: "2019-01-14 19:00",
        color: "#4285F4"
      },
      {
        name: "event 3",
        start: "2019-01-14 18:30",
        end: "2019-01-14 20:30",
        color: "#4285F4"
      },
      {
        name: "event 4",
        start: "2019-01-14 19:00",
        end: "2019-01-14 20:00",
        color: "#4285F4"
      },
      {
        name: "event 6",
        start: "2019-01-14 21:00",
        end: "2019-01-14 23:00",
        color: "#4285F4"
      },
      {
        name: "event 7",
        start: "2019-01-14 22:00",
        end: "2019-01-14 23:00",
        color: "#4285F4"
      }
    ]
  }),
  computed: {
    //fab add event
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { class: "purple", icon: "account_circle" };
        case "two":
          return { class: "red", icon: "edit" };
        case "three":
          return { class: "green", icon: "keyboard_arrow_up" };
        default:
          return {};
      }
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    submit() {
      if (this.$refs.form.validate()) {
        console.log("Valid :)");
      } else {
        console.log("Not valid :( !");
      }
    },
    reset() {
      this.dialog = false;
      this.$refs.form.reset();
    }
  },
  watch: {
    top(val) {
      this.bottom = !val;
    },
    right(val) {
      this.left = !val;
    },
    bottom(val) {
      this.top = !val;
    },
    left(val) {
      this.right = !val;
    }
  }
};
</script>

<style lang="scss" scoped>
/* This is for documentation purposes and will not be needed in your application */
#create .v-dialog {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
#create .floatButton {
  position: relative;
  float: right;
  top: -65px;
}
</style>
