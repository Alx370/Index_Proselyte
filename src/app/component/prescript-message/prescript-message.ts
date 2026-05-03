import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-prescript-message',
  imports: [Footer],
  templateUrl: './prescript-message.html',
  styleUrl: './prescript-message.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptMessage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly userName = signal('');
  protected readonly prescriptText = signal('');
  protected readonly isTyping = signal(false);
  protected readonly isCleared = signal(false);

  private readonly speed = 50;
  private typingTimer: ReturnType<typeof setInterval> | null = null;

  private readonly timestamp_general = [' hours', ' days', ' weeks', ' months'];
  private randomTimestampSelect = 0;
  private randomTimestamp = '';

  ngOnInit(): void {
    const state = history.state as { name?: string };
    this.userName.set(state.name ?? 'Unknown');
  }

  protected namePrefix(): string {
    return '【To ' + this.userName() + '】';
  }

  private typeEffect(fullText: string): void {
    if (this.typingTimer !== null) {
      clearInterval(this.typingTimer);
    }

    this.prescriptText.set('');
    this.isTyping.set(true);

    let i = 0;
    this.typingTimer = setInterval(() => {
      if (i < fullText.length) {
        this.prescriptText.update(current => current + fullText.charAt(i));
        i++;
      } else {
        clearInterval(this.typingTimer!);
        this.typingTimer = null;
        this.isTyping.set(false);
      }
    }, this.speed);
  }

  protected clearPrescript(): void {
    if (this.typingTimer !== null) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
    }
    this.prescriptText.set('【_CLEAR._】');
    this.isTyping.set(false);
    this.isCleared.set(true);
  }

  protected newPrescriptDisplay(): void {
    this.isCleared.set(false);
    this.typeEffect(this.generatePrescript());
  }

  private rand(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private pick<T>(arr: T[]): T {
    return arr[this.rand(arr.length)];
  }

  private generatePrescript(): string {
    // ── base pools ──────────────────────────────────────────────────────────
    const directions = [
      'north', 'northeast', 'east', 'southeast',
      'south', 'southwest', 'west', 'northwest',
    ];

    const days = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday',
    ];

    const colors = [
      'red', 'blue', 'yellow', 'green', 'purple', 'orange', 'white',
      'cyan', 'pink', 'light blue', 'golden', 'light green',
      'light purple', 'light orange', 'light pink',
    ];

    const foods = [
      'pasta', 'spaghetti', 'pizza', 'a risotto', 'sushi', 'bread',
      'a baguette', 'curry', 'a HamHamPangPang sandwich', 'a cheeseburger',
      'plain white rice', 'fried rice',
      this.pick(colors) + '-colored foods',
    ];

    const verbs = [
      'help ',
      'hug ',
      'trade a precious item with ',
      'gouge out the left eye of ',
      'gouge out the right eye of ',
      'exchange vows with ',
      'engage in a fistfight with ',
      'rip out the spine of ',
      'crush the skull of ',
      'give ' + this.pick(colors) + ' flowers to ',
      'take a walk with ',
      'hold hands with ',
      'buy dinner to ',
      'eat a meal with ',
      'head out on an extended vacation with ',
      'ask what is the name of ',
      'dance with ',
      'send a love letter to ',
      'send a handwritten confession letter to ',
    ];

    const numbers = [
      'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
      'eighth', 'ninth', 'tenth', 'eleventh', 'twelveth', 'thirteenth',
    ];

    const things_to_be = [
      'animal', 'dog', 'cat', 'child', 'office worker', 'Fixer', 'saint',
      'priest', 'writer', 'artist', 'twin sibling', 'oldest sibling',
      'youngest sibling', 'Syndicate member', 'Thumb member', 'Middle member',
      'Index member', 'Ring member', 'Thumb Soldato', 'Thumb Capo',
      'Index Proselyte', 'Index Messenger', 'Middle Little Sibling',
      'Middle Young Sibling', 'Ring Student', 'Ring Docent', 'person',
      'quadruped animal', 'insect', 'ant', 'person walking a dog',
      'Index Proxy',
    ];

    const relationships = [
      'your next-door neighbor',
      'your nearest coworker',
      'your nearest Index member',
      'a total stranger',
      'your best friend',
      'the ' + this.pick(numbers) + ' ' + this.pick(things_to_be) + ' you see',
      'the ' + this.pick(numbers) + ' ' + this.pick(things_to_be) + ' you meet',
      'your dreams',
      'the one you couldn\'t kill',
      'someone who wronged you',
      'every ' + (this.rand(100) + 1) + ' year old in your neighborhood',
      'the face in the mirror',
      'your mother',
      'your father',
      'your ' + this.pick(numbers) + ' neighbor down the road',
      'the person you hate the most',
      'the person you love the most',
      'residents that live in the same building as you',
      'your next-door neighbors',
      'the leader of the closest Syndicate',
      'one you would consider a friend',
      'one you would consider a friend, but they do not',
      'someone that considers you a friend, but you do not',
      'your doctor',
      'a Color Fixer',
      'a Grade 5 Fixer',
      'a Grade 8 Fixer',
      'the first person you see wearing ' + this.pick(colors),
    ];

    const locations1 = [
      'hotel', 'motel', 'alleyway', 'office building', 'Syndicate den',
      'bakery', 'convenience store', 'murky alleyway', 'your house',
      this.pick(relationships) + '\'s house', 'your workplace',
    ];

    const locations2 = [
      'District ' + (this.rand(25) + 1),
      'nearest ' + this.pick(locations1) + ' to you',
      'nearest ' + this.pick(locations1) + ' ' + this.pick(directions) + ' of you',
      'on top of a trash can',
      'on a rooftop',
      'on the rooftop of the tallest building you can find in your District',
    ];

    // ── timestamp ────────────────────────────────────────────────────────────
    this.randomTimestampSelect = this.rand(4);
    this.randomTimestamp =
        this.rand(100).toString() + this.timestamp_general[this.randomTimestampSelect];

    // ── singles ──────────────────────────────────────────────────────────────
    const singles = [
      'Play rock paper scissors with the third person you meet and play rock. If you win, pull out 59 strands of their hair. Then, apply seafood-cream pasta sauce with mealworms fed on styrofoam to it three times, and eat it with a fork.',
      "Put 3 needles in your neighbor's birthday cake.",
      'Make risotto out of sewer water, and feed it to the person next door.',
      'Rip out the spine of someone who wronged the Index.',
      'Kill the painting you\'ve drawn.',
      'Move an unicorn plushie to a park.',
      'See green from a white wall.',
      'Stand on any three-way intersection at 3:38 tomorrow, look to the east, and wave seven times.',
      'Exchange the left leg of the fourteenth person you come across today with the right leg of the twenty-sixth person you run into.',
      'When you see a person on a three-way intersection waving their hand seven times, follow them to their house.',
      'Kill all the doors of the ceiling.',
      'Consume your vocal cords, boiled for 14 seconds in simmering salt water, as part of your dinnertime meal.',
      'Climb to the rooftop of a building 3 stories or higher and wave your hand while looking down for 1 minute.',
      'Enter as the third customer of the day to a restaurant that sells chickens, and leave last.',
      'Start a game of hide-and-seek with at least three people, then return home as the "it."',
      'Read six books, then visit the District that appears in the last book read. No time limit.',
      'Kill the liar within the alley within alleys.',
      'Pack a lunchbox and consume it on top of a trash can in the streets of District 11 at 1 PM today.',
      'Bake dacquoise while the hour hand rests between 7 and 8, and eat it while watching a movie.',
      'Initiate a game of Never Have I Ever with the first five people you encounter. When one folds a finger, break it.',
      'Neatly clip the nails of the sixty-second person you come across.',
      'Pet quadrupedal animals five times.',
      'Spin a wheel and throw a cake at the person determined by the result.',
      'Consume eight crabs stored at room temperature and ripe persimmon at once.',
      'At the railing on the roof of a building, shout out the name of the person you dislike, then jump off. The height of the building does not matter.',
      'After a meal, discard all dishes that were used to serve it.',
      'On the morning after receiving the Prescript, drink three cups of water as soon as you get up.',
      'Race against residents that live in the same building as you to District 7. Measure the distance every twenty-three minutes and disqualify the one farthest away from the destination.',
      'Within three days, knit a scarf with a butterfly pattern.',
      "Dial any number. Give a New Year's greetings and words of blessing to whoever receives the call.",
      "When hungry, consume a Cheeki's cheeseburger with added onion.",
      'Fold 39 paper cranes and throw them from the rooftop.',
      'At work, cut the ear of the first person to fulminate against you.',
      'When your eyes meet another person\'s, nod at them.',
      'Return to your home this instant. You may leave once a dog barks in front of your house one time.',
      'Wear light green clothing and take 10 steps in a triangle-shaped alley.',
      'When penetrating the lungs with a stiletto, lay vertical the end, insert up to the wick.',
      'Destroy the sound, crush flat the thought.',
      'Sleep for a total of 800 hours per day.',
      'Drink a liter of milk. Warm up before you go play.',
      'Only read, write, or pull the trigger with your right hand.',
      'In 30 minutes, find a groom or bride - bonus if brunette. In 90 hours, spill their insides. Paint the room picture sque.',
      'In 400000 meters, turn right.',
      'Do not go home until you finish reading the value of e.',
      "Grind upon dawn's rail.",
      'Shove an entire orange inside a grapefruit, then hit it with a hammer repeatedly while meowing at 9:34 on a Friday night.',
      'Untie every shoelace in your household. You may re-tie them after you are next greeted by name.',
      'Open and close a ' + this.pick(directions) + '-facing window ' + this.rand(50) + ' times, then close the curtains for the rest of the week.',
      'Walk to the nearest intersection and head south for 17 blocks. Within 13 days, descend to the lowest floor of the building you arrive at. If you meet a man there, shake his hand.',
      "Start drawing, and do nothing else until you're done. Print it out and eat it.",
      "Gut a fish and place one ounce of the meat on " + this.pick(relationships) + "'s pillow, along with the bones. Consume the rest raw without exception.",
      'Drink eight full cups of water within a twenty four hour period.',
      'Immediately locate and play the nearest physical copy of a video game. If you cannot complete it within 24 hours, dye your hair ' + this.pick(colors) + '.',
      'Walk up to the front door of a random house on your street. If they have a door camera, perform a magic trick while staring into the camera, then leave. Do not make a sound.',
      "The next time you lose in a card game, eat every card in the winner's hand. If they attempt to stop you, also eat their hand.",
      'Solve ' + this.rand(50) + ' nonogram puzzles in a row.',
      'Go out for a walk with your left shoe untied, and when someone notices, tell them that their right shoe is untied.',
      'At the crossroads, do not turn left.',
      'Make out an image of something in the trees, then fear it for ' + this.randomTimestamp + '.',
      "Take a Proxy out to a nice restaurant of their choosing. If you both order the same thing, leave without paying.",
      'Recite the value of e.',
      'At daybreak, noon, and sunset, go outside and bask in the sunlight, take a picture with the sun, and wave at the sun.',
      'Fill a blender with even amounts of ketchup, hummus and molasses. Blend for 7 and a half minutes, and chug the result straight from the appliance.',
      'Purchase tickets for a flight that is over 3 hours long and ensure you will sit next to two strangers in the middle seat. Quietly smack your lips every 5-10 minutes for the duration of the flight.',
      'Do ' + this.rand(50) + ' cartwheels immediately.',
      'Eat ' + this.rand(100) + ' peas. Be sure to peel each one and separate the two halves.',
      'Alter your body. Mirror the Fixer lost to the Library.',
      'Show this Prescript to your nearest Proxy. They will understand what it means.',
      'For the next twelve and three-forths of an hour, only walk with your feet faced ' + this.pick(directions) + '. They are not allowed to be offset from this direction by up to five degrees. When the time ends, repeat the Prescript, although walking only using your heels.',
      'Remember to aim for the heart.',
      "Read out the entirety of 'Prayer For Loving Sorrow'.",
      'Watch a Tortoise Spiral reach its end.',
      "Wordlessly hug someone who looks like they need it the least.",
      "Invent a new gender-neutral alternative to niece/nephew within the next ten minutes. Consider this Prescript failed if the person nearest in proximity to you doesn't like it.",
      'Listen to the sound of the waves for ' + this.rand(10) + ' hours.',
      'Draw the muse that lives in your head.',
      'Spin around counterclockwise until you see triple, then stab the fake illusions until they bleed shadows.',
      'On the third day of the next month, walk past 3 people who are holding hands, tap their shoulders 3 times and offer a handshake. If they don\'t comply, you must start over.',
      'Doodle something in the feedback page of this website.',
      'While carrying a pile of books, crash into someone.',
      'Challenge every right-handed person who is not an Index member that you encounter to a staring contest, until you lose. Give meaning to the person who beat you.',
      'Count the teeth of the next ' + this.rand(21) + ' people you meet. If any have fewer than 32, replace the missing ones with your own teeth.',
      'Next time you are in a lifethreatening situation, take a 20 minute break. You must act as if nothing fazes you for the duration of the break.',
      'Go to a graveyard and lay across the ' + this.pick(numbers) + ' grave you see. Before 30 minutes have passed, make sure to water your dreams.',
      'Let her voice reach you. Do as she says.',
      'Let her voice reach you. Deny her will.',
      'Bring your daughter back home.',
      'Tell ' + this.pick(relationships) + ' about the future. Ensure it comes to pass.',
    ];

    // ── times (first slot) ───────────────────────────────────────────────────
    const times_firstslot = [
      'Tomorrow, ',
      'This evening, ',
      'Next week, ',
      'In ' + this.randomTimestamp + ', ',
      'As soon as possible, ',
      'For the next ' + this.randomTimestamp + ', ',
      'On the morning after receiving the Prescript, ',
      'On the afternoon after receiving the Prescript, ',
      'On the evening after receiving the Prescript, ',
      'At midnight, ',
      'Within ' + this.randomTimestamp + ', ',
      'During the Night in the Backstreets, ',
      'Next time you cross paths with ' + this.pick(relationships) + ', ',
      'When your eyes meet with ' + this.pick(relationships) + ', ',
      'When you are next given a Prescript, ',
      'Next time you encounter someone, ',
      'Within ' + this.rand(200) + ' hours, ',
      'Within ' + this.randomTimestamp + ', on a ' + this.pick(days) + ', ',
      'Until someone stops you, ',
      'The next time you are in a life threatening situation, ',
      'Before the next snowfall, ',
      'Before the next time it rains, ',
      'The next time you fall in love, ',
      'During your next meal, ',
      'After you spot a rainbow, ',
      'When at work, ',
      'When in a classroom, ',
      'Next ' + this.pick(days) + ', ',
    ];

    // ── activities (second slot) ─────────────────────────────────────────────
    const activities_secondslot = [
      'eat bitter.',
      'jump from a roof. The height does not matter.',
      'jump from a roof. It must be at least ' + this.rand(200) + ' meters tall.',
      'fetch a cup of water.',
      'drink a cup of sewage.',
      'grab a coffee with a friend.',
      'shoot yourself.',
      'help ' + this.pick(relationships) + ' cross the street.',
      this.pick(verbs) + this.pick(relationships) + '.',
      this.pick(verbs) + this.pick(relationships) + '.',
      this.pick(verbs) + this.pick(relationships) + '.',
      this.pick(verbs) + this.pick(relationships) + '.',
      this.pick(verbs) + this.pick(relationships) + '.',
      'immigrate to a different district.',
      'look at yourself in the mirror.',
      'give ' + this.pick(relationships) + ' a manicure.',
      'wave to ' + this.pick(relationships) + ' ' + (this.rand(14) + 1) + ' times  a day.',
      'nod to ' + this.pick(relationships) + ' ' + (this.rand(14) + 1) + ' times.',
      'fight with ' + this.pick(relationships) + ' to the death.',
      'bake cookies and give them to ' + this.pick(relationships) + '.',
      'take ' + (this.rand(50) + 1) + ' steps in an alley.',
      'head to (a) ' + this.pick(locations1) + ' with ' + this.pick(relationships) + '.',
      'run for ' + this.rand(100) + ' hours facing ' + this.pick(directions) + '. If anyone stands in your way, cut them down.',
      'walk for ' + this.rand(100) + ' hours facing ' + this.pick(directions) + '. If anyone stands in your way, cut them down.',
      'apply seafood-cream pasta sauce with mealworms fed on styrofoam to ' + this.pick(foods) + ' three times. Eat it with a fork.',
      'spill your blood into the nearest toilet.',
      'tell ' + this.pick(relationships) + ' your darkest secret.',
      'buy tickets to a WARP train ride. They must be Economic Class.',
      'buy tickets to a WARP train ride. They must be First Class.',
      'board the next WARP train.',
      'board a WARP train with ' + this.pick(relationships) + '.',
      'wish a happy new year to a couple walking a dog.',
      'head ' + this.pick(directions) + ' for ' + (this.rand(50) + 1) + ' blocks.',
      'start a bug band.',
      'run into traffic.',
      'steal copper wiring from the house of ' + this.pick(relationships) + '.',
      "immediately go and knock on your neighbor's door. If they answer, exchange Prescripts with them, then follow their Prescript to the letter.",
      'destroy fate.',
      'convince someone else to fail this Prescript.',
      'recite the value of e.',
      'sleep in opposite sides of the bed and in different positions.',
      'leave all the houselights on.',
      'go to sleep, and do not wake until the following morning.',
      'seek that which will fill your heart.',
      'apply for a job.',
      'rip the blinds.',
      'sit on a comfortable chair and sleep. When you wake up, act like you have been awake the whole time.',
      'look out your window and throw your least valuable possession towards the head of ' + this.pick(relationships) + '. If it hits, drink a cup of water. If it misses, your next Prescript shall be done twice.',
      'if you are in your bedroom, state your first thought out loud. Otherwise, jump around the first thing you see on toes.',
      'get the name of the next of kin from the next opponent you defeat. If they do not have one, behead them.',
      'play tag with ' + this.pick(relationships) + ', and make sure you win.',
      'play tag with ' + this.pick(relationships) + '. You do not need to win.',
      'weep from joy, sorrow, and fear.',
      'give yourself a secret name.',
      'drink from a puddle in the street.',
      'pet the nearest dog, even if it means breaking into somewhere.',
      'brew a cup of oolong tea.',
      'brew a cup of black tea.',
      'for ' + this.rand(100) + ' minutes, read a book without using any devices.',
      "spend 23 hours as usual. In the 24th, engage in something you've never done before.",
      'tap the shoulder of the person in front or behind you, then tell them that the person next to you said they like them.',
      'insult a member of the Thumb, and blame it on someone else.',
      'insult a member of the Middle, and blame it on someone else.',
      'learn how to crochet with your fingers.',
      'paint the sky as you see it in the moment.',
      'do the macarena.',
      'do a backflip.',
      'find ' + this.pick(relationships) + ', and speak your mind to them.',
      'speak only in numbers until you are told to stop.',
      'hand this Prescript to a Proxy. They will understand what it means.',
      'send a message to ' + this.pick(relationships) + ' asking about their day.',
      'invite ' + this.pick(relationships) + ' inside your home.',
      'take a bubble bath.',
      "search for a District that doesn't exist.",
      'make someone up in your head, and pretend you are them in your next ' + this.rand(10) + ' interactions. They must be very different from the you you are.',
      'cross something off your bucket list.',
    ];

    // ── activities (first slot) ──────────────────────────────────────────────
    const activities_firstslot = [
      'Fix your posture, ',
      'Forget your own reflection, ',
      'Take a selfie, ',
      'Turn off your nearest computer, ',
      'Take a shower, ',
      'Ask for a different prescript, ',
      'Get banned from your most used social media, ',
      'Read a book with a ' + this.pick(colors) + ' cover, ',
      'Rip off the arms of ' + this.pick(relationships) + ', ',
      'Rip off the legs of ' + this.pick(relationships) + ', ',
      'Look ' + this.pick(directions) + ' for ' + this.randomTimestamp + ', without ever moving your head away, ',
      'Burn the last gift you received, ',
      'Pack a lunchbox, ',
      'Pack for a short trip, ',
      'Pack for a long trip, ',
      'Flip a coin until you get heads, ',
      'Flip a coin until you get tails, ',
      'Walk to the nearest intersection, ',
      "Reap what you've sowed, ",
      'Find ' + this.pick(relationships) + ', ',
      'Invite ' + this.pick(relationships) + ' to your home, ',
      'Order a rice dish, count all of the individual grains, ',
      'Walk into the nearest bookstore, pick the ' + this.pick(numbers) + ' book you see, read it cover to cover, ',
      'Bring the head of ' + this.pick(relationships) + ' to ' + this.pick(relationships) + ', ',
      'Eat only ' + this.pick(colors) + ' colored foods for ' + this.randomTimestamp + ', ',
      'Eat nothing but ' + this.pick(foods) + ' for ' + this.randomTimestamp + ', ',
      'Buy a food magazine and underline every instance of the word "pepper", ',
      'Convince ' + this.pick(relationships) + ' to ' + this.pick(activities_secondslot) + ' Let it sink in, ',
      'Order ' + this.pick(foods) + ' and give it to ' + this.pick(relationships) + ', ',
      'Go to the nearest fast food restaurant, order the ' + this.pick(numbers) + ' item your eyes fall on, ',
      'Find yourself in the creases of the couch, ',
      'During the Night in the Backstreets, kill ' + (this.rand(50) + 1) + ' or more Sweepers, ',
      "Picture yourself in your favorite Association's uniform, ",
      'Record a bird for ' + (this.rand(50) + 1) + ' minutes, ',
      "Ask someone about their 'ideal', ",
      'Break the ' + this.pick(numbers) + ' clock you see, ',
      'Go to the closest school, ',
      'Clap without a sound, ',
      "Name five things you can't see, ",
      'Run late to an important event with a piece of toast in your mouth, ',
      'Express an opinion on social media you disagree with, ',
      'Do a ten-pull on your latest played gacha game, ',
      'Write a song for ' + this.pick(relationships) + ', ',
      'Order something different from the usual in your most frequented restaurant, ',
      'Brew a cup of green tea, ',
      'Dance to the melody in your head, ',
      'List ' + (this.rand(10) + 1) + ' positive things about yourself in a napkin, ',
      'Read the entirety of the ' + this.pick(numbers) + ' random article you draw on Wikipedia, ',
      'Play a game you have not opened in years, ',
    ];

    // ── markers ──────────────────────────────────────────────────────────────
    const markers = [
      'then ',
      'and immediately afterwards, ',
      'but before you do that, ',
      'and once you do, ',
      'pretend nothing happened, and ',
      'and ',
      'let it sink in, and ',
      "but if you can't, ",
    ];

    // ── postscript ───────────────────────────────────────────────────────────
    const postscript = [
      ' No time limit.',
      ' You must be wearing ' + this.pick(colors) + '.',
      ' Remember to wear glasses when you do.',
      ' Leave no witnesses.',
      ' Return home as soon as you can.',
      ' Close the door immediately.',
      ' Be sure to keep an eye behind you.',
      " Take a break when you're done.",
      ' The next time you receive a Prescript, remember you have to disobey it.',
      ' You must hold your breath for the duration.',
      ' Afterwards, ' + this.pick(activities_secondslot),
      " Once you're done, " + this.pick(activities_secondslot),
      ' You must not blink.',
      ' Before you do that, ' + this.pick(activities_secondslot),
      ' Time limit: ' + this.rand(100) + this.timestamp_general[this.rand(4)] + '.',
      " Don't let yourself be caught.",
      ' Shower immediately afterwards.',
      ' Once this Prescript is done, you may consider yourself a Proselyte of the Index.',
      ' Once this Prescript is done, you will be promoted to Proxy. Congratulations.',
      ' Once this Prescript is done, you will be promoted to Messenger. Congratulations.',
      ' Time limit: before you next spot three crows on the same electric wire.',
      ' Ask yourself if it was worth it.',
      ' Invite a friend to do the same.',
      ' You can bring ' + this.pick(relationships) + ' along.',
    ];

    const structure = this.rand(5) + 1;
    let finalPrescript: string;

    switch (structure) {
      case 1:
        finalPrescript = this.pick(singles);
        break;
      case 2:
        finalPrescript = this.pick(times_firstslot) + this.pick(activities_secondslot);
        break;
      case 3:
        finalPrescript = this.pick(activities_firstslot) + this.pick(markers) + this.pick(activities_secondslot);
        break;
      case 4:
        finalPrescript = this.pick(times_firstslot) + this.pick(activities_secondslot) + this.pick(postscript);
        break;
      case 5:
      default:
        finalPrescript = this.pick(activities_firstslot) + this.pick(markers) + this.pick(activities_secondslot) + this.pick(postscript);
        break;
    }

    // reset timestamp for next call
    this.randomTimestamp =
        this.rand(100).toString() + this.timestamp_general[this.randomTimestampSelect];

    return '【' + finalPrescript + '】';
  }
}