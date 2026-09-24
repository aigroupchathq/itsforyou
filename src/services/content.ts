import { Chapter, Citation, ExerciseDef, Tone } from '../types';

export function pickTone<T>(obj: { grounded: T; poetic: T }, tone: Tone): T {
  return obj[tone] ?? obj.grounded;
}

export const HOOK_CONTENT = {
  line1: {
    grounded: 'Notice the last thought that passed through your cortex.',
    poetic: 'Notice the last whisper that crossed your inner silence.',
  },
  line2: {
    grounded: 'Where did it originate? What initiated its electrical chain?',
    poetic: 'Where did it rise from? Which depth gave it breath?',
  },
  line3: {
    grounded: "You didn't author it. It emerged into awareness uninvited.",
    poetic: 'You did not summon it. It arrived like a cloud across an open sky.',
  },
  delayFact: {
    grounded:
      'Neuroimaging reveals that supplementary motor areas and prefrontal cortex ignite 300 to 500 milliseconds before you become consciously aware of a decision. The thought is already finished by the time "you" hear it.',
    poetic:
      'Long before the conscious self proclaims "I think", the mystery has already spoken in the silence. You are not the producer of the voice; you are the vast listening space in which it echoes.',
  },
};

export const CITATIONS: Record<string, Citation> = {
  libet: {
    id: 'libet',
    type: 'science',
    title: 'Time of Conscious Intention to Act in Relation to Onset of Cerebral Activity (Readiness Potential)',
    authorOrSource: 'Benjamin Libet et al., Brain (1983)',
    year: '1983',
    summary: {
      grounded:
        'Demonstrated that the Bereitschaftspotential (readiness potential) in the motor cortex initiates approximately 350-550ms before a subject reports conscious intention (W-time) to act.',
      poetic:
        'The body and the unconscious field register movement long before the narrative mind claims ownership of the volition.',
    },
    keyTakeaway: 'Conscious awareness is a retrospective observer, not the primary initiating driver of spontaneous thought.',
  },
  predictive: {
    id: 'predictive',
    type: 'science',
    title: 'The Free-Energy Principle and Predictive Brain Architecture',
    authorOrSource: 'Karl Friston & Andy Clark, Nature Reviews Neuroscience',
    year: '2010',
    summary: {
      grounded:
        'The brain is a hierarchical Bayesian prediction machine. Rather than passively receiving sensory input, it continuously hallucinates expected reality and only processes prediction error.',
      poetic:
        'We do not touch the raw world directly; we live inside a living tapestry of memory and projection that our awareness can gently see through.',
    },
    keyTakeaway: 'Your emotional reactions are generated prior to confirmation; observing them breaks automated feedback loops.',
  },
  defusion: {
    id: 'defusion',
    type: 'science',
    title: 'Acceptance and Commitment Therapy (ACT) & Cognitive Defusion',
    authorOrSource: 'Steven C. Hayes, Kirk Strosahl, Kelly G. Wilson',
    year: '2004',
    summary: {
      grounded:
        'Cognitive defusion techniques shift the individual from looking FROM thoughts (cognitive fusion) to looking AT thoughts as mere verbal events in the cognitive stream.',
      poetic:
        'Stepping out of the rushing river onto the riverbank. You no longer drown in the current; you simply watch the water rush past.',
    },
    keyTakeaway: 'Thoughts have zero inherent physical force; their power exists only when awareness collapses into identity.',
  },
  dmn: {
    id: 'dmn',
    type: 'science',
    title: 'A Default Mode of Brain Function & Metacognitive Deactivation',
    authorOrSource: 'Marcus E. Raichle et al., PNAS',
    year: '2001',
    summary: {
      grounded:
        'The Default Mode Network (medial prefrontal cortex, posterior cingulate) underlies self-referential rumination and past/future time projection. Metacognitive presence suppresses DMN hyper-activity.',
      poetic:
        'The chronic narrator that weaves the myth of "me" settles into silence the instant true presence turns its gaze upon it.',
    },
    keyTakeaway: 'The sense of an isolated ego is an ongoing metabolic neural construction that pauses during pure observation.',
  },
  coherence: {
    id: 'coherence',
    type: 'contemplative',
    title: 'Autonomic & Psychophysiological Coherence Model',
    authorOrSource: 'Rollin McCraty et al., HeartMath Institute',
    year: '2009',
    summary: {
      grounded:
        'Rhythmic breathing (0.1 Hz) coordinates heart rate variability with respiratory sinus arrhythmia, shifting sympathetic overdrive into parasympathetic stability.',
      poetic:
        'When internal conflict ceases, the heart and mind settle into a resonant wave, broadcasting tranquility into your immediate environment.',
    },
    keyTakeaway: 'A lens on physiological resonance: calm physiology transforms the cognitive filtering of perceived reality.',
  },
  collective: {
    id: 'collective',
    type: 'contemplative',
    title: 'Memetic Transmission & The Collective Conditioning Pool',
    authorOrSource: 'Richard Dawkins / Contemplative Philosophy & Jungian Psychology',
    year: '1976',
    summary: {
      grounded:
        'Over 65% of repetitive cognitive loops are viral memetic constructs inherited from cultural conditioning, parental fear scripts, and social mimicry.',
      poetic:
        'You have been drinking from an ancient cultural reservoir without realizing the water was seasoned with centuries of collective worry.',
    },
    keyTakeaway: 'Most of what troubles your mind was never yours to begin with.',
  },
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    number: '01',
    exerciseId: '1',
    canvasMode: 'static',
    kicker: {
      grounded: 'Signal Detection Theory & Cognitive Fusion',
      poetic: 'The Cosmic Receiver',
    },
    title: {
      grounded: 'The Radio: Signal vs. Static',
      poetic: 'The Radio in the Empty Chamber',
    },
    subtitle: {
      grounded: 'The fatal error is mistaking the speaker for the broadcast.',
      poetic: 'The instrument is innocent of the song it receives.',
    },
    paragraphs: {
      grounded: [
        'Imagine turning on a vintage radio receiver. When static crackles or a sorrowful melody pours through the mesh grill, you do not blame the wood and wire for composing the music. You recognize it as an antenna tuned to a frequency in the atmospheric spectrum.',
        'Yet with the human mind, we make the fundamental attribution error every second. A sudden surge of anxiety or inadequacy sparks across the synaptic cleft, and instantly awareness fuses with it: "I am anxious. I am broken."',
        'Cognitive science calls this "cognitive fusion." In reality, the cortical apparatus is an ultra-sensitive bio-receiver. The chatter it registers is primarily background static generated by biological survival instincts, ambient stress, and associative memory.',
        'The moment you step backward and witness the static without attempting to edit it, the neurochemistry of threat alters. You are no longer the broadcast; you are the room listening.',
      ],
      poetic: [
        'In the quiet chamber of the body, a radio has been left playing since the day of your birth. Sometimes it transmits static; sometimes it hums ancient ancestral grief; sometimes it announces emergencies that never arrive.',
        'Because you grew up inside the chamber, you forgot the music was traveling from afar. You knelt before the speaker and whispered: "This song is who I am."',
        'It is not. You are the space in which the vibration rises and falls. The radio cannot hurt the silence that holds it.',
        'When you stop tuning the dial in panic, the entire room fills with a stillness deeper than any frequency.',
      ],
    },
    citations: ['libet', 'defusion'],
    exercisePrompt: {
      grounded: 'Practice 01: Cognitive Labeling — Tag spontaneous thoughts as external events.',
      poetic: 'Practice 01: The Naming of Clouds — Witness each passing vapor without holding its hand.',
    },
  },
  {
    id: 'chapter-2',
    number: '02',
    exerciseId: '2',
    canvasMode: 'prediction',
    kicker: {
      grounded: 'Hierarchical Predictive Processing',
      poetic: 'The Architect of Illusions',
    },
    title: {
      grounded: 'The Prediction Machine',
      poetic: 'The Weaver of Ghosts',
    },
    subtitle: {
      grounded: 'Your brain does not see the world. It calculates what should be there.',
      poetic: 'You walk through a museum made of yesterday’s expectations.',
    },
    paragraphs: {
      grounded: [
        'Under the predictive processing model formulated by Karl Friston and Andy Clark, the brain is not an input-output processor. It is a closed-box Bayesian prediction engine. Sensory data does not construct your experience; your internal generative model constructs it, using sensory input merely to calculate prediction error.',
        'When you enter a difficult meeting or speak to a partner, your limbic circuitry projects past emotional wounds forward onto the micro-expressions of the other person. You react to the model, not the person.',
        'Most suffering is not a response to what is occurring, but a defensive reflex against a phantom scenario manufactured 400 milliseconds before sensory validation.',
        'By cultivating deliberate metacognitive latency, you suspend automatic top-down prediction and permit the unvarnished reality of the moment to breathe.',
      ],
      poetic: [
        'The mind is a painter working feverishly behind closed shutters. Before light can reach your eyes, the painter has already splashed the canvas with old fears, familiar tragedies, and inherited scripts.',
        'You look at a loved one and see a memory of betrayal. You look at an open door and see an ancient cage. You are always arriving at an appointment with yesterday.',
        'Yet when the painter realizes someone is standing silently behind him, watching his brush in the dark, his hand trembles and stops.',
        'In that pause, the shutters swing open. The sunlight that enters owes nothing to the past.',
      ],
    },
    citations: ['predictive'],
    exercisePrompt: {
      grounded: 'Practice 02: Source Tracking — Trace a charged emotional prediction back to its root schema.',
      poetic: 'Practice 02: Unmasking the Mirage — Trace the heavy emotion to the ghost that first wore it.',
    },
  },
  {
    id: 'chapter-3',
    number: '03',
    exerciseId: '3',
    canvasMode: 'coherence',
    kicker: {
      grounded: 'Autonomic Regulation & Entrainment',
      poetic: 'The Calming of the Waters',
    },
    title: {
      grounded: 'From Noise to Coherence',
      poetic: 'The Still Center of the Storm',
    },
    subtitle: {
      grounded: 'Entraining heart rate variability to pacify cortical turbulence.',
      poetic: 'When the ripples rest, the lake remembers the sky.',
    },
    paragraphs: {
      grounded: [
        'When awareness is fragmented across dozens of simultaneous micro-threats, the autonomic nervous system enters sympathetic dysregulation. Heart rate variability (HRV) patterns become chaotic, and prefrontal executive function degrades.',
        'Coherence is not the absence of mental activity; it is the phase-locking of physiological oscillators. When respiration slows to roughly 0.1 Hertz (six breaths per minute), the baroreflex loop harmonizes heart rhythm, arterial pressure, and cortical EEG rhythms.',
        'In this coherent physiological state, the neural signal-to-noise ratio in the anterior cingulate cortex clarifies dramatically. The compulsive urge to react to every passing thought dissolves.',
        'Awareness ceases to thrash against its own ripples and stabilizes into an unshakable baseline.',
      ],
      poetic: [
        'Throw a stone into a tempest, and the surface answers with frenzy. But lower a lantern into deep water, and the depths receive the glow without agitation.',
        'When your breath lengthens, the beating of the chest and the spinning of the mind remember their secret covenant. They fall into rhythm like two oars dipping into glassy dawn water.',
        'Coherence is not a battle won over chaos. It is the natural gravity of peace when you stop stirring the glass.',
        'Rest here. Watch how effortlessly the mud settles when the hand lets go.',
      ],
    },
    citations: ['coherence'],
    exercisePrompt: {
      grounded: 'Practice 03: Awareness Anchor — 10-minute guided 4-block autonomic stabilization.',
      poetic: 'Practice 03: The Deep Anchor — Return to the quiet tide within.',
    },
  },
  {
    id: 'chapter-4',
    number: '04',
    exerciseId: '4',
    canvasMode: 'collective',
    kicker: {
      grounded: 'Memetics & Social Conditioning',
      poetic: 'The Ancestral River',
    },
    title: {
      grounded: 'The Collective Pool',
      poetic: 'The Borrowed Chorus',
    },
    subtitle: {
      grounded: 'Up to 70% of repetitive mental loops are recycled cultural debris.',
      poetic: 'You are carrying grief that belonged to strangers.',
    },
    paragraphs: {
      grounded: [
        'Anthropologist and evolutionary biologist perspectives emphasize that human cognition developed through rapid mimetic transmission. The human infant survives by swallowing whole the anxiety postures, status anxieties, and scarcity narratives of its tribe.',
        'When you audit your internal self-criticism—the urgent voice demanding you prove your worth, hoard security, or dread judgment—how much of it represents authentic first-principles intelligence?',
        'Empirical cognitive sorting reveals that over two-thirds of daily intrusive thoughts are verbatim echoes of parental distress, societal media feeds, and generational trauma.',
        'You are not responsible for the debris that was poured into your stream before you had the discernment to build a filter. Your sole duty is to stop drinking it as truth.',
      ],
      poetic: [
        'Listen closely to the voices that condemn you at midnight. Whose accent do they speak with? Which schoolyard, which dining table, which ancestor whispered those sentences into your cradle?',
        'You are carrying heavy sacks across the desert, convinced they contain your sins, only to discover they are filled with someone else’s broken heirlooms.',
        'The moment you look directly into the eyes of inherited sorrow, it bows its head. It was only waiting for someone conscious enough to say: "You may rest now."',
        'Lay down what was never yours.',
      ],
    },
    citations: ['collective'],
    exercisePrompt: {
      grounded: 'Practice 04: Origin Investigation — Sort incoming impulses into Direct, Personal, and Collective.',
      poetic: 'Practice 04: The Great Unburdening — Return the borrowed voices to the wind.',
    },
  },
  {
    id: 'chapter-5',
    number: '05',
    exerciseId: '5',
    canvasMode: 'response',
    kicker: {
      grounded: 'Observer-Expectancy & Attentional Gating',
      poetic: 'The Mirror of Being',
    },
    title: {
      grounded: 'Reality Responds',
      poetic: 'The World as an Echo',
    },
    subtitle: {
      grounded: 'Attentional bias creates the exact conditions it anticipated.',
      poetic: 'The valley only returns the cry you gave it.',
    },
    paragraphs: {
      grounded: [
        'In psychology, the self-fulfilling prophecy is not mysticism—it is the biological consequence of selective attentional gating. The reticular activating system filters 99.9% of sensory data to highlight cues that confirm the existing cognitive schema.',
        'If your internal observer operates from an unexamined assumption of hostility, your micro-expressions tighten, your vocal prosody cools, and your posture becomes guarded. Others register this subliminal threat and retreat. Reality appears to confirm your worst dread.',
        'When you shift the posture of the observer from hyper-vigilance to spacious equanimity, your neuro-somatic signaling completely transforms the interpersonal field.',
        'Reality does not change by magical decree; reality responds because the observer stopped manufacturing the antagonism.',
      ],
      poetic: [
        'Stand before a canyon and shout in fury; the stone walls will answer with ten thousand furious voices. Weep into the canyon, and the stones weep back.',
        'For decades we have shaken our fists at the stone walls, demanding they soften their tone, oblivious to the fact that the throat that screamed was our own.',
        'When you fall into profound stillness, the world around you softens its jagged edges. Strangers relax their shoulders. Doors that seemed locked reveal they were never latched.',
        'Change the silence you bring to the room, and the room rearranges itself around you.',
      ],
    },
    citations: ['predictive', 'defusion'],
    exercisePrompt: {
      grounded: 'Practice 05: Reality Response Journal — 30-day tracking of internal state vs. external events.',
      poetic: 'Practice 05: The Dialogue with the World — Record how the mirror responds to your quietness.',
    },
  },
  {
    id: 'chapter-6',
    number: '06',
    exerciseId: '6',
    canvasMode: 'observer',
    kicker: {
      grounded: 'Self-As-Context (Relational Frame Theory)',
      poetic: 'The Unclouded Sky',
    },
    title: {
      grounded: 'The Unshakable Observer',
      poetic: 'The Sky That Knows No Weather',
    },
    subtitle: {
      grounded: 'Differentiating the container of consciousness from its transient contents.',
      poetic: 'No hurricane has ever injured the empty space it raged through.',
    },
    paragraphs: {
      grounded: [
        'Relational Frame Theory delineates three tiers of self-concept: the Self-as-Content (the personal narrative of achievements and wounds), the Self-as-Process (continuous awareness of thoughts and sensations), and the Self-as-Context (the invariant perspective from which all experience is observed).',
        'When you identify with Self-as-Content, every emotional failure threatens your existential survival. You are the fragile ship being battered by every wave.',
        'When you ground in Self-as-Context, you discover that awareness itself has no weight, no edges, and no vulnerability. Pain can enter the container, but it cannot scratch the glass.',
        'This is the metacognitive shift: not positive thinking, but resting in the invulnerable awareness that effortlessly holds both joy and grief.',
      ],
      poetic: [
        'Thunder cracks across the mountain. Hail batters the pine trees. Black clouds tear across the horizon. Yet the sky itself—the infinite blue void that hosts the storm—remains completely untouched.',
        'The sky does not ask the storm to depart; it has plenty of room for thunder. And when the squall exhausts itself, the sky has neither gained nor lost a single atom of its serenity.',
        'You are that sky. Your despair, your triumphs, your regrets—they are merely weather passing through your infinity.',
        'Rest as the space. Let the weather do what weather must do.',
      ],
    },
    citations: ['defusion', 'dmn'],
    exercisePrompt: {
      grounded: 'Practice 06: Identity Shift Protocol — Migrate awareness from narrative ego to witnessing container.',
      poetic: 'Practice 06: Remembering the Sky — Stand as the vastness behind the storm.',
    },
  },
  {
    id: 'chapter-7',
    number: '07',
    exerciseId: '7',
    canvasMode: 'integration',
    kicker: {
      grounded: 'Applied Somatic Metacognition',
      poetic: 'The Living Sanctuary',
    },
    title: {
      grounded: 'Integration in Action',
      poetic: 'Walking in the Light',
    },
    subtitle: {
      grounded: 'Extending metacognitive sovereignty into relationships, somatic health, and work.',
      poetic: 'Bringing the temple into the marketplace.',
    },
    paragraphs: {
      grounded: [
        'Metacognitive realization is meaningless if it terminates at the meditation cushion. The crucible of awareness is the difficult phone call, the deadline pressure, the bank statement, the somatic flare-up.',
        'Integration requires anchoring the observer perspective during physiological arousal. In every situation, there is an unbridgeable four-part sequence: Orient to sensory reality, Observe the automated prediction, Choose from core values, and Embody the unreactive presence.',
        'When this sequence becomes second nature, the default-mode rumination network permanently attenuates. You operate with cognitive agility and emotional sovereignty.',
        'You no longer react to life; life encounters an unmovable, lucid presence.',
      ],
      poetic: [
        'It is simple to be a sage in a silent cave. The sacred art is remaining the serene sky while standing in traffic, while paying a bill, while listening to a wounded voice speak in anger.',
        'Take this stillness into the streets. Let your gaze be an invitation for others to lay down their armor. Where there was tension, leave spaciousness.',
        'You are not a person striving to achieve enlightenment. You are consciousness, temporarily wearing a coat of dust, learning to see through its own dream.',
        'Step forward. The entire world is waiting to be observed with love.',
      ],
    },
    citations: ['defusion', 'predictive'],
    exercisePrompt: {
      grounded: 'Practice 07: Daily Integration — 20-minute structured alignment across 4 life domains.',
      poetic: 'Practice 07: The Sacred Everyday — Anchor awareness in the rhythm of your life.',
    },
  },
];

export const EXERCISE_DEFS: Record<string, ExerciseDef> = {
  '1': {
    id: '1',
    number: 1,
    type: 'labeling',
    daysTotal: 7,
    cadence: 'Daily · 5-10 min',
    name: {
      grounded: 'Cognitive Defusion & Thought Labeling',
      poetic: 'The Naming of the Clouds',
    },
    goal: {
      grounded: 'De-automate thought fusion by categorizing mental intrusions into objective neurological tags.',
      poetic: 'Release the grasping hand; watch mental vapors drift across the inner horizon.',
    },
    scienceBasis:
      'Neuroimaging confirms that verbal labeling of emotional stimuli downregulates amygdala activity via ventrolateral prefrontal cortex inhibition (Lieberman et al.).',
    instructions: {
      grounded: [
        'Sit comfortably and close your eyes or soften your gaze.',
        'As each mental impulse appears, tap its objective classification chip.',
        'Notice how the metacognitive gap (the distance between you and the thought) physically widens.',
        'Complete at least 10 observations to log your daily session.',
      ],
      poetic: [
        'Settle into the quiet chair of the witness.',
        'When a voice or image drifts across the void, gently acknowledge its nature.',
        'Do not push it away or pull it near. Simply name it and watch it dissolve.',
        'Each name you grant is a key unlocking your freedom.',
      ],
    },
  },
  '2': {
    id: '2',
    number: 2,
    type: 'journal',
    daysTotal: 14,
    cadence: 'Daily · 10 min',
    name: {
      grounded: 'Predictive Source & Etiology Tracking',
      poetic: 'Tracing the Ghost to Its Source',
    },
    goal: {
      grounded: 'Identify the underlying predictive schema and childhood/experiential trigger behind charged reactions.',
      poetic: 'Unmask the phantom that painted your fear and release it from duty.',
    },
    scienceBasis:
      'Cognitive restructuring decodes chronic Bayesian prediction errors by revealing historical conditioning roots.',
    instructions: {
      grounded: [
        'Document a specific thought that triggered an acute emotional charge today.',
        'Calibrate its somatic intensity on the 1-10 slider.',
        'Select the cognitive distortion category (Catastrophizing, Mind-Reading, Scarcity, etc.).',
        'Write out the traced origin: whose fear was this originally?',
      ],
      poetic: [
        'Bring forward the thought that troubled your peace today.',
        'Measure how deeply the heart tightened.',
        'Identify which disguise the illusion wore.',
        'Trace the river back to its cold source and allow the sun to warm it.',
      ],
    },
  },
  '3': {
    id: '3',
    number: 3,
    type: 'timer',
    daysTotal: 21,
    cadence: '2× Daily · 10 min',
    name: {
      grounded: 'Autonomic Awareness Anchor (4 Blocks)',
      poetic: 'The Deep Anchor of Being',
    },
    goal: {
      grounded: 'Shift autonomic tone from sympathetic fight-or-flight into high parasympathetic vagal regulation.',
      poetic: 'Rest in the timeless cradle of the breath; dissolve into the boundless void.',
    },
    scienceBasis:
      '0.1Hz resonant breathing synchronizes heart rate variability with respiratory sinus arrhythmia to dampen amygdalar firing.',
    instructions: {
      grounded: [
        'Block 1 (2.5m): Settle somatic posture and relax muscle tonus.',
        'Block 2 (2.5m): Anchor attentional focus exclusively to diaphragmatic breath.',
        'Block 3 (2.5m): Widen sensory awareness to all 360-degree auditory and somatic inputs.',
        'Block 4 (2.5m): Rest as the pure, ungraspable witness behind all perception.',
      ],
      poetic: [
        'Phase 1: Welcome the body home; let the bones grow heavy.',
        'Phase 2: Marry awareness to the tide of breath.',
        'Phase 3: Dissolve the walls; let sound and sensation wash through you.',
        'Phase 4: Abide as the pure openness in which universes appear and fade.',
      ],
    },
  },
  '4': {
    id: '4',
    number: 4,
    type: 'sorting',
    daysTotal: 21,
    cadence: 'Daily · 7 min',
    name: {
      grounded: 'Thought Origin Investigation & Noise Metric',
      poetic: 'The Sorting of Borrowed Gold',
    },
    goal: {
      grounded: 'Quantify the recycled noise ratio of daily thoughts: Direct vs. Personal History vs. Collective Conditioning.',
      poetic: 'Distinguish your true living wisdom from the collective clamor of the marketplace.',
    },
    scienceBasis:
      'Memetic auditing breaks automatic social contagion loops and reduces default-mode rumination loops by up to 60%.',
    instructions: {
      grounded: [
        'Type in 5 thoughts that arose in your mind recently.',
        'Classify each: Direct Sensory, Personal Conditioning, or Collective Memetic Noise.',
        'Review your calculated Recycled Noise Percentage.',
        'Log your session to train cognitive discernment.',
      ],
      poetic: [
        'Bring the thoughts that visited you into the clearing.',
        'Test their weight: Is this fresh rain, an old wound, or a crowd’s whisper?',
        'Witness how much of your burden was never yours to carry.',
        'Seal your session in the ledger of clarity.',
      ],
    },
  },
  '5': {
    id: '5',
    number: 5,
    type: 'phased-journal',
    daysTotal: 30,
    cadence: 'Daily · 10 min',
    name: {
      grounded: 'Reality Response Journal (4 Weekly Phases)',
      poetic: 'The Mirror of Reality Protocol',
    },
    goal: {
      grounded: 'Track empirical correlations between internal observer state and external behavioral/social outcomes.',
      poetic: 'Observe how the world dances in response to the stillness of your gaze.',
    },
    scienceBasis:
      'Longitudinal tracking of attentional gating and non-reactivity produces measurable shifts in interpersonal outcomes.',
    instructions: {
      grounded: [
        'Week 1: Pure baseline documentation of emotional reactions without intervention.',
        'Week 2: Mapping recurrent stimulus-reaction loops and bodily tensions.',
        'Week 3: Active cognitive defusion during interpersonal friction.',
        'Week 4: Documenting empirical shifts in external counterpart reactions.',
      ],
      poetic: [
        'Week 1: Gaze into the pool without touching the surface.',
        'Week 2: Map the stones that make the ripples.',
        'Week 3: Step backward into the cool grass as the ripples pass.',
        'Week 4: Watch the water turn to glass; see the sky reflected whole.',
      ],
    },
  },
  '6': {
    id: '6',
    number: 6,
    type: 'phased-journal',
    daysTotal: 30,
    cadence: 'Daily · 12 min',
    name: {
      grounded: 'Identity Shift Protocol: Self-As-Context',
      poetic: 'The Unshakable Sanctuary',
    },
    goal: {
      grounded: 'Systematically migrate self-identification from transient narrative ego to invariant witnessing consciousness.',
      poetic: 'Awaken as the boundless sky that knows no injury from storms.',
    },
    scienceBasis:
      'Relational Frame Theory & ACT therapeutic core: moving from Self-as-Content to Self-as-Context dissolves existential anxiety.',
    instructions: {
      grounded: [
        'Phase 1 (Days 1-7): Narrative Inventory — List the core stories you tell about your limitations.',
        'Phase 2 (Days 8-14): The Reframe — Rewrite each story as an external weather report.',
        'Phase 3 (Days 15-21): Deep Inquiry — "Who is aware of this thought right now?"',
        'Phase 4 (Days 22-30): Embodied Context — Operating as the invariant space throughout work and stress.',
      ],
      poetic: [
        'Phase 1: Write down the roles and tragedies you believed you were.',
        'Phase 2: Fold the costumes and place them gently on the bench.',
        'Phase 3: Turn the lamp inward: Who is the one who sees?',
        'Phase 4: Walk into the world as pure morning light.',
      ],
    },
  },
  '7': {
    id: '7',
    number: 7,
    type: 'timer',
    daysTotal: 30,
    cadence: 'Daily · 20 min',
    name: {
      grounded: 'Daily Integration: Multi-Domain Sovereignty',
      poetic: 'The Master of the Temple',
    },
    goal: {
      grounded: 'Systematic 4-step metacognitive deployment across Relationships, Work, Somatics, and Finances.',
      poetic: 'Infuse every corner of your earthly life with the radiance of pure presence.',
    },
    scienceBasis:
      'Context-dependent transfer of metacognitive self-regulation across disparate executive-functioning domains.',
    instructions: {
      grounded: [
        'Select target domain: Relationships, Career/Work, Somatic Vitality, or Resource Allocation.',
        'Step 1 (5m): Orient — Ground in physical sensory baselines.',
        'Step 2 (5m): Observe — Detect cognitive bias and defensive scripts.',
        'Step 3 (5m): Choose — Formulate action aligned with highest values rather than fear.',
        'Step 4 (5m): Embody — Rehearse physiological composure and non-reactivity.',
      ],
      poetic: [
        'Choose your sacred altar: A relationship, your craft, your body, or your livelihood.',
        'Step 1: Arrive fully in the flesh and the room.',
        'Step 2: Watch the old knots and habit patterns loosen.',
        'Step 3: Whisper your deepest vow of love and integrity.',
        'Step 4: Stand tall in the world, unswayed by the gusts of fate.',
      ],
    },
  },
};
