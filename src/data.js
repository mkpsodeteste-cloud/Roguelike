export const CHARACTERS = {
  seraphine: {
    id: 'seraphine',
    name: 'Seraphine Vale',
    short: 'Seraphine',
    title: 'The Fallen Saint',
    epithet: 'Saint of the Broken Choir',
    color: '#b47cff',
    accent: '#e0365c',
    portrait: 'assets/characters/seraphine_portrait.png',
    gallery: 'assets/characters/seraphine_gallery.png',
    chibi: 'assets/characters/seraphine_chibi.png',
    quote: '“Kneel if you like. I won’t stop you — but I do expect you to mean it.”',
    galleryQuote: '“I fell because heaven was too small for a woman with my appetite.”',
    lore: 'Once the high saint of the Choir of Ash, Seraphine blessed armies before sending them to die. When she refused to bless the burning of a city, her own order clipped her halo and cast her into the Nave. She wears the broken ring like a crown and treats every confession as an invitation.',
    memory: 'Memory recovered: Seraphine’s hands, still trembling, holding a candle over a child’s grave. She prayed to no one. The candle burned for seven days.',
    affinityName: 'Profane Devotion',
    oath: 'Oath of the Fallen — begin each run with a shield that absorbs one hit.',
    sceneIntro: 'She is draped across the ruined altar as though it were a throne, one long leg crossed over the other, silver hair spilling into the candlelight. She does not look surprised to see you.',
    dialogue: [
      {
        minBond: 1,
        text: '“There you are. I was beginning to think the dark had swallowed you whole.” Her smile sharpens. “Or perhaps you were simply admiring the architecture. Most men do — eventually.”',
        choices: [
          { text: '“I was admiring something far more dangerous.”', reply: '“Careful.” Her voice drops to velvet. “Dangerous things enjoy being admired. We tend to take it as an invitation.”', delta: 2, tag: 'FLIRT' },
          { text: '“I came to ask for your blessing.”', reply: '“A blessing?” She laughs, low and warm. “Darling, my blessings have a terrible survival rate. Ask for something else.”', delta: 1 },
          { text: '“I need to know the way through the Nave.”', reply: '“Straight through the great arch, little lamb. The Widow will find you before you find her. Do try to make it interesting.”', delta: 0 },
        ],
      },
      {
        minBond: 2,
        text: 'She has moved to the gallery rail, bare shoulders silvered by moonlight. “You survived. I had a wager with Mirelle. She said you would come back missing an arm. I said you would come back looking for me.”',
        choices: [
          { text: '“Who won the wager?”', reply: '“I did, of course.” She turns, and the broken halo catches the light. “Though I confess I expected more of a dramatic entrance. Next time, bleed a little.”', delta: 2, tag: 'FLIRT' },
          { text: '“You were worried about me.”', reply: '“Worried?” A pause. A flicker of something honest behind the amusement. “I have been alive a very long time, Warden. Worry is a luxury I am trying to relearn.”', delta: 1, tag: 'SINCERE' },
          { text: '“I’m not here to amuse you.”', reply: '“No?” She tilts her head. “Then why do you keep coming back?” The question lands gently. It still lands.', delta: 0 },
        ],
      },
      {
        minBond: 3,
        text: '“I dreamed of the choir again.” She does not turn from the window. Her reflection is fractured in the stained glass. “They were singing my name. Not the way you say it, though. Not like a question.”',
        choices: [
          { text: '“How do I say it?”', reply: 'She is quiet for a moment. “Like you already know the answer and are only waiting for me to catch up.” Her reflection smiles. “It is unnerving. Do it again.”', delta: 2, tag: 'INTIMATE' },
          { text: '“You don’t have to carry that alone.”', reply: '“Don’t I?” She finally faces you. “I was made to carry things alone. It is the only thing I have never failed at.” A breath. “Stay. Just — stay a while.”', delta: 2, tag: 'SINCERE' },
          { text: '“The dead are dead. The living are here.”', reply: '“How very practical.” Her smile is thin. “Perhaps that is why the living keep leaving.”', delta: 0 },
        ],
      },
      {
        minBond: 4,
        text: 'She is waiting by the portal, dressed for war in black lace and silver. “If you die down there, I will be exceedingly annoyed. I have compiled a list of things I intend to do to you when you return, and it would be a shame to waste it.”',
        choices: [
          { text: '“Give me the short version.”', reply: 'She leans close, close enough that her breath warms your ear. “The short version is you, me, and a door that locks from the inside. The long version requires dinner first.”', delta: 2, tag: 'FLIRT' },
          { text: '“I’ll come back. I promise.”', reply: 'Her teasing expression softens into something almost fragile. “Promises from beautiful fools. Fine. I accept.” She presses something cold into your palm — a broken piece of halo. “Bring it back.”', delta: 2, tag: 'VOW' },
          { text: '“If I die, you’ll have to find someone else to bother.”', reply: '“Don’t.” The word is sharp, then quiet. “Do not joke about that. Not with me.”', delta: 1, tag: 'SERIOUS' },
        ],
      },
      {
        minBond: 5,
        text: '“The oath is simple.” Her hands frame your face; her eyes are bright as fracture. “One life. Yours. Offered to me, freely, and returned tenfold. The Choir called it heresy. I call it the only honest prayer I have ever spoken.”',
        choices: [
          { text: '“Then let me be your prayer.”', reply: 'She kisses the corner of your mouth — a benediction, a threat, a promise. “Careful, darling. I intend to answer this one.”', delta: 2, tag: 'BOND' },
          { text: '“I need no oath to stand with you.”', reply: '“No. But I would like to hear you choose me anyway.” Her thumb traces your jaw. “Say it.” “You.” “Good. Keep saying it.”', delta: 2, tag: 'BOND' },
        ],
      },
    ],
    repeats: ['“Still alive. How disappointing for my enemies, and how delightful for me.”', '“Come closer. I dislike speaking to you from a distance. It makes you look almost innocent.”', '“The next time you descend, bring me something bleeding. I am sentimental about gifts.”'],
    idle: 'Seraphine turns a broken halo shard between her fingers, watching you like a puzzle she intends to solve slowly.',
  },

  mirelle: {
    id: 'mirelle',
    name: 'Mirelle Nox',
    short: 'Mirelle',
    title: 'The Velvet Ember',
    epithet: 'Demon of the Gilded Counter',
    color: '#ff8a5c',
    accent: '#31d5a1',
    portrait: 'assets/characters/mirelle_portrait.png',
    gallery: 'assets/characters/mirelle_gallery.png',
    chibi: 'assets/characters/mirelle_chibi.png',
    quote: '“Everything has a price, darling. Even the things that feel free — especially those.”',
    galleryQuote: '“I have sold kings their crowns and queens their secrets. I have never once sold my own heart. Yet.”',
    lore: 'Mirelle runs the Velvet Exchange from a pocket of the Nave that should not exist. She has been expelled from three courts, two churches, and one very exclusive underworld salon. She claims to be a demon of appetite, but her ledger is full of names she has quietly saved.',
    memory: 'Memory recovered: the Exchange’s ledger, in Mirelle’s hand — a column of debts marked PAID in green ink. Every one belongs to someone who left the Nave alive.',
    affinityName: 'Lavish Indulgence',
    oath: 'Oath of the Velvet Ember — gain 25% more Embers during a run.',
    sceneIntro: 'The Exchange smells of cardamom, hot metal, and trouble. Mirelle is behind the counter, sleeves pushed up, weighing something that smokes. She looks up. The smoke curls into the shape of a heart before it dies.',
    dialogue: [
      {
        minBond: 1,
        text: '“Well, if it isn’t my favourite returning investment.” Mirelle sets the smoking thing down and props her chin on one golden hand. “Let me guess. You need something sharpened, something healed, or something you’re not ready to ask for out loud.”',
        choices: [
          { text: '“Why don’t you guess which one?”', reply: 'She grins, slow and bright. “Oh, darling. I only get three guesses and you’re the type to make me use all of them.”', delta: 2, tag: 'FLIRT' },
          { text: '“Something sharpened. For now.”', reply: '“A man of restraint. How novel.” She slides a blade across the counter. “There. Free of charge. I’m curious to see how long the restraint lasts.”', delta: 1 },
          { text: '“I’m looking for a way deeper.”', reply: '“Deeper is expensive.” Her smile does not waver. “But for you, I can be persuaded to offer a line of credit. The interest is ruinous. I’m told that’s part of the charm.”', delta: 0 },
        ],
      },
      {
        minBond: 2,
        text: '“I heard what you did in the Reliquary.” She is not smiling now, exactly; something brighter and more dangerous. “You came back for the shrine girl. The one with the cracked ribs. You carried her out and then you went back in.”',
        choices: [
          { text: '“You were watching?”', reply: '“I watch all my investments.” A beat. “Some of them a little more closely than is strictly professional.”', delta: 2, tag: 'FLIRT' },
          { text: '“She needed help. It’s not complicated.”', reply: '“For most people it would be.” She pours two glasses of something amber. “Sit. I want to hear the part where you pretend not to be proud of yourself.”', delta: 2, tag: 'SINCERE' },
          { text: '“People are not investments.”', reply: '“No?” She raises a brow. “Then what are they, darling? Tell me. I have been in the business a long time.”', delta: 1 },
        ],
      },
      {
        minBond: 3,
        text: 'The shop is empty, candles burned low. Mirelle is sitting on the counter, heels tapping, tail curled around a bottle. “I closed early. Don’t read anything into it. I simply had a gap in my schedule and a very specific desire to see you.”',
        choices: [
          { text: '“What if I read everything into it?”', reply: 'She smiles, soft at the edges. “Then I would have to admit that I dressed for it. Which would be mortifying. So don’t.” Her tail tightens, just slightly, around her ankle.', delta: 2, tag: 'INTIMATE' },
          { text: '“May I close the rest of the distance?”', reply: 'Her breath catches — a tiny, human sound. “You may. But I warn you, darling: I never let anyone close for free.” She hooks a finger in your collar. “You’ll owe me. And I intend to collect.”', delta: 2, tag: 'INTIMATE' },
          { text: '“I could use a drink.”', reply: '“Ah. The coward’s opening.” She pours anyway. “Fine. But you’re sitting closer than that.”', delta: 1 },
        ],
      },
      {
        minBond: 4,
        text: '“I have a confession.” She turns a small red vial in her fingers, not looking at you. “I have given you three discounts this week. I have never given anyone a discount. My reputation is in shambles. My tail is unmanageable.”',
        choices: [
          { text: '“Is this your way of saying you like me?”', reply: '“It is my way of saying that if you die in my shop I will resurrect you specifically to kill you again.” She finally looks up. “Yes. That was a yes.”', delta: 2, tag: 'FLIRT' },
          { text: '“I’ll pay the difference.”', reply: '“With what?” She laughs when you hesitate. “That was the right answer, darling. You have nothing I want except the one thing you keep giving away for free.”', delta: 1 },
          { text: '“I would never cost you your reputation.”', reply: 'She sets the vial down. “No. You would cost me far more.” Her smile is very tender, and very sad, and gone in a blink.', delta: 2, tag: 'SINCERE' },
        ],
      },
      {
        minBond: 5,
        text: '“The oath of the Velvet Ember is a trade.” Mirelle holds out her hand, palm up, where a green flame is already burning. “You give me your hunger. I give you the means to feed it. No strings. No fine print.” A pause. “Well. One string. You come back to me.”',
        choices: [
          { text: '“Then take my hand, Mirelle.”', reply: 'She laces her fingers through yours and the flame turns gold. “Mine,” she says, very softly, as if testing the word. Then, louder: “Now buy something. I have a reputation to rebuild.”', delta: 2, tag: 'BOND' },
          { text: '“Only if you come with me.”', reply: 'The flame gutters. “Darling. I can’t leave the Exchange.” “Then I’ll keep coming back. Every time.” Her smile is the most honest thing you have ever seen. “Yes. Do that.”', delta: 2, tag: 'BOND' },
        ],
      },
    ],
    repeats: ['“Back again? Either you’re exceptionally brave or exceptionally bad with money. I like both.”', '“Touch anything you like, darling. The merchandise, I mean. Mostly.”', '“I saved you the good bottle. Don’t make it weird. Well. Make it a little weird.”'],
    idle: 'Mirelle counts a stack of black coins. When she sees you looking, she lets one slide down her sleeve with a wink.',
  },

  ysolde: {
    id: 'ysolde',
    name: 'Ysolde of the Thorn',
    short: 'Ysolde',
    title: 'The Crimson Duelist',
    epithet: 'Vampire of the Shattered Court',
    color: '#5fe2db',
    accent: '#bb1c42',
    portrait: 'assets/characters/ysolde_portrait.png',
    gallery: 'assets/characters/ysolde_gallery.png',
    chibi: 'assets/characters/ysolde_chibi.png',
    quote: '“You hold your blade like a question. I prefer men who make statements.”',
    galleryQuote: '“I have outlived every rival, every lover, every kingdom. Do you know what I have never outlived? A good duel.”',
    lore: 'Ysolde was the champion of a court that no longer exists, bound to a sword that drinks memory instead of blood. She remembers every opponent she has killed — except the one she loved. She has been looking for that face in every challenger since.',
    memory: 'Memory recovered: a ballroom, a waltz, two women laughing. Ysolde’s own face, younger and unguarded. The other woman’s face is a smear of ink, as if the memory itself refused to hold.',
    affinityName: 'Crimson Vow',
    oath: 'Oath of the Thorn — critical strikes heal you for a portion of the damage dealt.',
    sceneIntro: 'Ysolde is practising alone in the ruined ballroom, blade tracing arcs through the dust. She does not stop when you enter. She finishes the form, then turns, and levels the point at your throat with a smile.',
    dialogue: [
      {
        minBond: 1,
        text: '“You enter a duelist’s hall without drawing steel.” The rapier does not waver. “Either you trust me, or you have a death wish. Both are flattering, in their way.”',
        choices: [
          { text: '“I trust you.”', reply: 'The blade lowers. Something flickers behind her eyes — surprise, quickly hidden. “A dangerous habit. Keep it. I find I like the way it looks on you.”', delta: 2, tag: 'FLIRT' },
          { text: '“You’re not the only dangerous thing in this room.”', reply: 'She smiles with one fang. “No. But I am the best-dressed. En garde.” She taps your shoulder with the flat of her blade and turns away, satisfied.', delta: 1 },
          { text: '“I’m here to talk.”', reply: '“Then talk. I can listen and practise.” She resumes her form, but her eyes keep returning to you in the mirror.', delta: 0 },
        ],
      },
      {
        minBond: 2,
        text: '“You fight like someone who has never been taught.” Ysolde circles you slowly. “All instinct. Very little technique. It should be appalling.” A pause. “It is not.”',
        choices: [
          { text: '“Teach me, then.”', reply: 'She steps in close, adjusts your grip with cool fingers, and does not step back. “Lesson one: never let your opponent inside your guard.” She is inside it now. “Lesson two: if you must break a rule, make it worth it.”', delta: 2, tag: 'FLIRT' },
          { text: '“Instinct keeps me alive.”', reply: '“For now.” She steps back. “Technique keeps you alive when instinct is screaming. Come back tomorrow. Bring your worst habits. I will make them elegant.”', delta: 1 },
          { text: '“I don’t need a teacher.”', reply: '“No one needs anything until they do.” She sheathes her blade. “The offer stands. It costs you nothing but the truth of where you learned to be so stubborn.”', delta: 1 },
        ],
      },
      {
        minBond: 3,
        text: 'She has opened the old ballroom doors. Beyond them, the floor is cracked and the chandelier hangs like a broken crown. “I used to dance here,” she says quietly. “Before. I remember the music. I do not remember my partner’s face.”',
        choices: [
          { text: '“Dance with me. Make a new memory.”', reply: 'She looks at you for a long moment. Then she bows, hand extended, old court manners wrapped around something raw. “One dance. Do not step on my feet. I am armed.”', delta: 2, tag: 'INTIMATE' },
          { text: '“Maybe the face isn’t the point.”', reply: '“No?” She turns. “Then what is?” “Whether you’d want them to come back.” Her blade hand tightens. “That is a cruel question.”', delta: 2, tag: 'SINCERE' },
          { text: '“The past is a wound. Let it close.”', reply: '“Some wounds are the only proof I have that I was ever someone.” She turns away. “You mean well. That is nearly worse.”', delta: 0 },
        ],
      },
      {
        minBond: 4,
        text: 'Ysolde is waiting with two rapiers laid across a table. “I have decided to tell you the truth. I am not sure I should. I am not sure I know how.” Her smile is thin. “You make me want to try. That is your fault.”',
        choices: [
          { text: '“Then try. I’m not going anywhere.”', reply: '“You say that as if it is simple.” She picks up the second blade and hands it to you, hilt first. “Very well. If I lose my nerve, challenge me. I never lose my nerve in a duel.”', delta: 2, tag: 'VOW' },
          { text: '“I don’t need the truth. I need you.”', reply: 'Her breath stops. “You cannot mean that.” “I do.” She closes her eyes, and when she opens them, the crimson is very bright. “Then you are a fool. My favourite kind.”', delta: 2, tag: 'INTIMATE' },
          { text: '“Some truths are better left buried.”', reply: '“Perhaps.” She looks at the empty ballroom. “But I have been buried for a very long time, and I am tired of it.”', delta: 1 },
        ],
      },
      {
        minBond: 5,
        text: '“The oath of the Thorn is not a vow of peace.” Ysolde’s rapier rests against your chest, point down, her hand over yours on the hilt. “It is a promise to keep duelling the world together. Until it yields. Or until we do.”',
        choices: [
          { text: '“Then draw, my lady.”', reply: 'Her grin is bright and sharp and real. She kisses you before you can move, quick as a blade, then steps back into guard. “Later, Warden. First, we make the dark yield.”', delta: 2, tag: 'BOND' },
          { text: '“I would rather yield to you.”', reply: 'The point drops. “Careful.” Her voice is rough. “I have killed men for less. I have wanted no one for longer.” She takes your hand. “Come. If we are to be foolish, let us at least be well-armed.”', delta: 2, tag: 'BOND' },
        ],
      },
    ],
    repeats: ['“Still standing. Good. I would hate to have to avenge you.”', '“Your form is improving. Your distraction is worsening. I take full credit for both.”', '“Come back in one piece. I have not finished teaching you how to lose gracefully.”'],
    idle: 'Ysolde watches the door even when she is smiling. Her fingers never leave her sword.',
  },

  // The player avatar. Kept out of CHARACTER_ORDER so she never appears in
  // the romance gallery or the sanctum roster.
  vesper: {
    id: 'vesper',
    name: 'Vesper',
    short: 'Vesper',
    title: 'The Ember Warden',
    epithet: 'Last Keeper of the Wake',
    color: '#ffb15c',
    accent: '#e05071',
    portrait: 'assets/characters/vesper_chibi.png',
    gallery: 'assets/characters/vesper_chibi.png',
    chibi: 'assets/characters/vesper_chibi.png',
    quote: '“The dark is patient. I am not.”',
    galleryQuote: '“Every oath I keep, I keep in fire.”',
    lore: 'A warden sworn to the dying ember at the heart of the Nave. Each descent costs her another memory; each return gives the three immortal women another reason to keep her.',
    memory: 'Memory recovered: a small hand in yours, a promise made in a burning doorway.',
    affinityName: 'The Wake',
    oath: 'Oath of the Warden — rise again, and again, until the dark yields.',
    sceneIntro: 'The Ember Warden stands at the threshold, sword already bare.',
    dialogue: [],
    repeats: ['“The dark is patient. I am not.”'],
    idle: 'Vesper checks the edge of her blade, then the door.',
  },
}

export const CHARACTER_ORDER = ['seraphine', 'mirelle', 'ysolde']

export const BOONS = [
  { id: 'crimson-edge', name: 'Crimson Edge', icon: '⚔', rarity: 'common', desc: '+25% melee damage. The blade remembers every hand that has held it.', effects: { meleeDmg: 0.25 } },
  { id: 'thorn-volley', name: 'Thorn Volley', icon: '✦', rarity: 'rare', desc: '+1 soul bolt per cast, spread in a fan. Each bolt deals 75% damage.', effects: { multishot: 1, projectileDmg: -0.1 } },
  { id: 'ember-heart', name: 'Ember Heart', icon: '❤', rarity: 'common', desc: '+30 maximum health and heal 30 immediately. It beats faster when she looks at you.', effects: { maxHp: 30, heal: 30 } },
  { id: 'sanguine-thirst', name: 'Sanguine Thirst', icon: '🩸', rarity: 'rare', desc: 'Heal for 8% of melee damage dealt. A little blood is a terrible thing to waste.', effects: { lifesteal: 0.08 } },
  { id: 'widows-grace', name: "Widow's Grace", icon: '❦', rarity: 'common', desc: '+12% movement speed and +6% attack speed. Every step a small seduction.', effects: { speed: 0.12, attackSpeed: 0.06 } },
  { id: 'executioner', name: 'Executioner', icon: '✕', rarity: 'rare', desc: '+12% critical strike chance. The verdict is always the same.', effects: { crit: 0.12 } },
  { id: 'phantom-bolt', name: 'Phantom Bolt', icon: '➶', rarity: 'rare', desc: 'Soul bolts pierce +1 enemy. Grief passes through people like that.', effects: { pierce: 1, rangedDmg: 0.1 } },
  { id: 'aegis', name: 'Shattered Aegis', icon: '⛨', rarity: 'epic', desc: 'Begin each chamber with a shield that absorbs one hit. It regenerates when the room is cleared.', effects: { shield: 1 } },
  { id: 'frenzy', name: 'Devout Frenzy', icon: '⚡', rarity: 'rare', desc: '+18% attack speed. Pray faster. Bleed faster.', effects: { attackSpeed: 0.18 } },
  { id: 'grave-wind', name: 'Grave Wind', icon: '➤', rarity: 'epic', desc: 'Dashing releases a damaging shockwave. Distance is a weapon.', effects: { dashBurst: 26 } },
  { id: 'consecrated-steel', name: 'Consecrated Steel', icon: '✧', rarity: 'rare', desc: 'Melee hits burn enemies for 18 damage over 3 seconds. Holy fire is still fire.', effects: { burn: 18 } },
  { id: 'blood-pact', name: 'Blood Pact', icon: '☩', rarity: 'epic', desc: '+45% all damage, but -20 maximum health. Every oath demands a tithe.', effects: { meleeDmg: 0.45, rangedDmg: 0.45, maxHp: -20 } },
  { id: 'moonlit-arc', name: 'Moonlit Arc', icon: '☾', rarity: 'rare', desc: '+30% melee range and a wider swing. The moon watches you swing.', effects: { meleeRange: 0.3, meleeArc: 20 } },
  { id: 'soul-siphon', name: 'Soul Siphon', icon: '◉', rarity: 'common', desc: 'Ranged hits restore 3 Ember. Waste nothing.', effects: { manaOnHit: 3 } },
  { id: 'gilded-hide', name: 'Gilded Hide', icon: '◈', rarity: 'rare', desc: 'Reduce all incoming damage by 12%. Beauty is armor.', effects: { damageReduction: 0.12 } },
  { id: 'hex', name: 'Withering Hex', icon: '⁂', rarity: 'epic', desc: 'Enemies take 18% more damage from all sources. A curse with excellent manners.', effects: { enemyVulnerable: 0.18 } },
]

export const BOON_MAP = Object.fromEntries(BOONS.map(b => [b.id, b]))

export const PERKS = [
  { id: 'vitality', name: 'Ashen Vitality', icon: '❤', desc: '+14 maximum health per rank.', max: 5, baseCost: 24, growth: 18, effects: { maxHp: 14 } },
  { id: 'might', name: 'Gilded Might', icon: '⚔', desc: '+7% all damage per rank.', max: 5, baseCost: 28, growth: 20, effects: { meleeDmg: 0.07, rangedDmg: 0.07 } },
  { id: 'swiftness', name: 'Widow’s Step', icon: '➤', desc: '+4% speed and -5% dash cooldown per rank.', max: 5, baseCost: 22, growth: 16, effects: { speed: 0.04, dashCd: -0.05 } },
  { id: 'soul', name: 'Ember Soul', icon: '✦', desc: '+12 maximum Ember and +1.5 Ember regeneration per rank.', max: 5, baseCost: 22, growth: 16, effects: { maxMana: 12, manaRegen: 1.5 } },
  { id: 'fortune', name: 'Velvet Fortune', icon: '❖', desc: '+10% Cinders earned per rank.', max: 4, baseCost: 30, growth: 22, effects: { cinderGain: 0.1 } },
  { id: 'edge', name: 'Saint’s Edge', icon: '✧', desc: '+3% critical chance per rank.', max: 4, baseCost: 34, growth: 24, effects: { crit: 0.03 } },
  { id: 'recovery', name: 'Last Rites', icon: '☩', desc: 'Begin each run with +20 health and a free heal on entering a rest chamber.', max: 3, baseCost: 26, growth: 20, effects: { startHeal: 20 } },
  { id: 'armor', name: 'Thorned Mantle', icon: '⛨', desc: 'Reduce incoming damage by 4% per rank.', max: 4, baseCost: 32, growth: 24, effects: { damageReduction: 0.04 } },
]

export const PERK_MAP = Object.fromEntries(PERKS.map(p => [p.id, p]))

export const ROOM_NAMES = [
  'The Sunken Nave', 'Reliquary of Sighs', 'The Thorn Garden', 'Hall of Gilded Tears',
  'The Drowned Choir', 'Crypt of Small Mercies', 'The Velvet Ossuary', 'Chapel of Broken Vows',
  'The Widow’s Table', 'Gallery of Unlit Saints', 'The Ashen Ballroom', 'Cradle of Cinders',
]

export const DEPTH_NAMES = ['THE SUNKEN NAVE', 'THE THORN GARDEN', 'THE GILDED OSSUARY', 'THE HOLLOW CROWN']

export const ENEMY_LORE = {
  wraith: { name: 'Choir Wraith', color: '#b47cff' },
  hound: { name: 'Ash Hound', color: '#ff8a5c' },
  cultist: { name: 'Veiled Cantor', color: '#e05071' },
  knight: { name: 'Hollow Knight', color: '#6fd8e0' },
  boss: { name: 'The Gilded Widow', color: '#ff5078' },
}

export const SHOP_QUOTES = [
  '“Everything has a price, darling. Even the things that feel free.”',
  '“You look like a man about to make a very expensive decision. I approve.”',
  '“Buy the good one. Regret is so much more fashionable when it’s well-funded.”',
  '“No refunds. I’m a demon, not a charity.”',
  '“For you? A discount. Don’t tell the others. They’ll want one too.”',
]

export const FLAVOR_QUOTES = [
  '“The deep does not hate you. It simply has excellent taste.”',
  '“Every saint was once someone’s bad decision.”',
  '“A blade is only honest when it is close enough to lie.”',
  '“The Widow collects beautiful things. Be careful how you shine.”',
  '“Three women are waiting. Try to die interestingly.”',
]
