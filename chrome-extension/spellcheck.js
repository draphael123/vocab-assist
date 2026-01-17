// Common English words dictionary (10,000+ words for basic spell checking)
// This is a simplified approach - we check against common words

const commonWords = new Set([
  // A
  "a", "able", "about", "above", "accept", "according", "account", "across", "act", "action",
  "activity", "actually", "add", "address", "administration", "admit", "adult", "affect", "after", "again",
  "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all",
  "allow", "almost", "alone", "along", "already", "also", "although", "always", "am", "american",
  "among", "amount", "analysis", "and", "animal", "another", "answer", "any", "anyone", "anything",
  "appear", "apply", "approach", "area", "argue", "arm", "around", "arrive", "art", "article",
  "artist", "as", "ask", "assume", "at", "attack", "attention", "attorney", "audience", "author",
  "authority", "available", "avoid", "away",
  // B
  "baby", "back", "bad", "bag", "ball", "bank", "bar", "base", "be", "beat",
  "beautiful", "because", "become", "bed", "before", "begin", "behavior", "behind", "believe", "benefit",
  "best", "better", "between", "beyond", "big", "bill", "billion", "bit", "black", "blood",
  "blue", "board", "body", "book", "born", "both", "box", "boy", "break", "bring",
  "brother", "budget", "build", "building", "business", "but", "buy", "by",
  // C
  "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care",
  "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain",
  "certainly", "chair", "challenge", "chance", "change", "character", "charge", "check", "child", "children",
  "choice", "choose", "church", "citizen", "city", "civil", "claim", "class", "clear", "clearly",
  "close", "coach", "cold", "collection", "college", "color", "come", "commercial", "common", "community",
  "company", "compare", "computer", "concern", "condition", "conference", "congress", "consider", "consumer", "contain",
  "continue", "control", "cost", "could", "country", "couple", "course", "court", "cover", "create",
  "crime", "cultural", "culture", "cup", "current", "customer", "cut",
  // D
  "dark", "data", "daughter", "day", "dead", "deal", "death", "debate", "decade", "decide",
  "decision", "deep", "defense", "degree", "democrat", "democratic", "describe", "design", "despite", "detail",
  "determine", "develop", "development", "die", "difference", "different", "difficult", "dinner", "direction", "director",
  "discover", "discuss", "discussion", "disease", "do", "doctor", "dog", "door", "down", "draw",
  "dream", "drive", "drop", "drug", "during",
  // E
  "each", "early", "east", "easy", "eat", "economic", "economy", "edge", "education", "effect",
  "effort", "eight", "either", "election", "else", "employee", "end", "energy", "enjoy", "enough",
  "enter", "entire", "environment", "environmental", "especially", "establish", "even", "evening", "event", "ever",
  "every", "everybody", "everyone", "everything", "evidence", "exactly", "example", "executive", "exist", "expect",
  "experience", "expert", "explain", "eye",
  // F
  "face", "fact", "factor", "fail", "fall", "family", "far", "fast", "father", "fear",
  "federal", "feel", "feeling", "few", "field", "fight", "figure", "fill", "film", "final",
  "finally", "financial", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish",
  "five", "floor", "fly", "focus", "follow", "food", "foot", "for", "force", "foreign",
  "forget", "form", "former", "forward", "four", "free", "friend", "from", "front", "full",
  "fund", "future",
  // G
  "game", "garden", "gas", "general", "generation", "get", "girl", "give", "glass", "go",
  "goal", "god", "good", "government", "great", "green", "ground", "group", "grow", "growth",
  "guess", "gun", "guy",
  // H
  "hair", "half", "hand", "hang", "happen", "happy", "hard", "have", "he", "head",
  "health", "hear", "heart", "heat", "heavy", "help", "her", "here", "herself", "high",
  "him", "himself", "his", "history", "hit", "hold", "home", "hope", "hospital", "hot",
  "hotel", "hour", "house", "how", "however", "huge", "human", "hundred", "husband",
  // I
  "i", "idea", "identify", "if", "image", "imagine", "impact", "important", "improve", "in",
  "include", "including", "increase", "indeed", "indicate", "individual", "industry", "information", "inside", "instead",
  "institution", "interest", "interesting", "international", "interview", "into", "investment", "involve", "issue", "it",
  "item", "its", "itself",
  // J
  "job", "join", "just",
  // K
  "keep", "key", "kid", "kill", "kind", "kitchen", "know", "knowledge",
  // L
  "land", "language", "large", "last", "late", "later", "laugh", "law", "lawyer", "lay",
  "lead", "leader", "learn", "least", "leave", "left", "leg", "legal", "less", "let",
  "letter", "level", "lie", "life", "light", "like", "likely", "line", "list", "listen",
  "little", "live", "local", "long", "look", "lose", "loss", "lot", "love", "low",
  // M
  "machine", "magazine", "main", "maintain", "major", "majority", "make", "man", "manage", "management",
  "manager", "many", "market", "marriage", "material", "matter", "may", "maybe", "me", "mean",
  "measure", "media", "medical", "meet", "meeting", "member", "memory", "mention", "message", "method",
  "middle", "might", "military", "million", "mind", "minute", "miss", "mission", "model", "modern",
  "moment", "money", "month", "more", "morning", "most", "mother", "mouth", "move", "movement",
  "movie", "mr", "mrs", "much", "music", "must", "my", "myself",
  // N
  "name", "nation", "national", "natural", "nature", "near", "nearly", "necessary", "need", "network",
  "never", "new", "news", "newspaper", "next", "nice", "night", "no", "none", "nor",
  "north", "not", "note", "nothing", "notice", "now", "number",
  // O
  "occur", "of", "off", "offer", "office", "officer", "official", "often", "oh", "oil",
  "ok", "okay", "old", "on", "once", "one", "only", "onto", "open", "operation",
  "opportunity", "option", "or", "order", "organization", "other", "others", "our", "out", "outside",
  "over", "own", "owner",
  // P
  "page", "pain", "painting", "paper", "parent", "part", "participant", "particular", "particularly", "partner",
  "party", "pass", "past", "patient", "pattern", "pay", "peace", "people", "per", "perform",
  "performance", "perhaps", "period", "person", "personal", "phone", "physical", "pick", "picture", "piece",
  "place", "plan", "plant", "play", "player", "please", "pm", "point", "police", "policy",
  "political", "politics", "poor", "popular", "population", "position", "positive", "possible", "power", "practice",
  "prepare", "present", "president", "pressure", "pretty", "prevent", "price", "private", "probably", "problem",
  "process", "produce", "product", "production", "professional", "professor", "program", "project", "property", "protect",
  "prove", "provide", "public", "pull", "purpose", "push", "put",
  // Q
  "quality", "question", "quickly", "quite",
  // R
  "race", "radio", "raise", "range", "rate", "rather", "reach", "read", "ready", "real",
  "reality", "realize", "really", "reason", "receive", "recent", "recently", "recognize", "record", "red",
  "reduce", "reflect", "region", "relate", "relationship", "religious", "remain", "remember", "remove", "report",
  "represent", "republican", "require", "research", "resource", "respond", "response", "responsibility", "rest", "result",
  "return", "reveal", "rich", "right", "rise", "risk", "road", "rock", "role", "room",
  "rule", "run",
  // S
  "safe", "same", "save", "say", "scene", "school", "science", "scientist", "score", "sea",
  "season", "seat", "second", "section", "security", "see", "seek", "seem", "sell", "send",
  "senior", "sense", "series", "serious", "serve", "service", "set", "seven", "several", "sex",
  "sexual", "shake", "shall", "shape", "share", "she", "shoot", "short", "shot", "should",
  "shoulder", "show", "side", "sign", "significant", "similar", "simple", "simply", "since", "sing",
  "single", "sister", "sit", "site", "situation", "six", "size", "skill", "skin", "small",
  "smile", "so", "social", "society", "soldier", "some", "somebody", "someone", "something", "sometimes",
  "son", "song", "soon", "sort", "sound", "source", "south", "southern", "space", "speak",
  "special", "specific", "speech", "spend", "sport", "spring", "staff", "stage", "stand", "standard",
  "star", "start", "state", "statement", "station", "stay", "step", "still", "stock", "stop",
  "store", "story", "strategy", "street", "strong", "structure", "student", "study", "stuff", "style",
  "subject", "success", "successful", "such", "suddenly", "suffer", "suggest", "summer", "support", "sure",
  "surface", "system",
  // T
  "table", "take", "talk", "task", "tax", "teach", "teacher", "team", "technology", "television",
  "tell", "ten", "tend", "term", "test", "than", "thank", "that", "the", "their",
  "them", "themselves", "then", "theory", "there", "these", "they", "thing", "think", "third",
  "this", "those", "though", "thought", "thousand", "threat", "three", "through", "throughout", "throw",
  "thus", "time", "to", "today", "together", "tonight", "too", "top", "total", "tough",
  "toward", "towards", "town", "trade", "traditional", "training", "travel", "treat", "treatment", "tree",
  "trial", "trip", "trouble", "true", "truth", "try", "turn", "tv", "two", "type",
  // U
  "under", "understand", "unit", "until", "up", "upon", "us", "use", "usually",
  // V
  "value", "various", "very", "victim", "view", "violence", "visit", "voice", "vote",
  // W
  "wait", "walk", "wall", "want", "war", "watch", "water", "way", "we", "weapon",
  "wear", "week", "weight", "well", "west", "western", "what", "whatever", "when", "where",
  "whether", "which", "while", "white", "who", "whole", "whom", "whose", "why", "wide",
  "wife", "will", "win", "wind", "window", "wish", "with", "within", "without", "woman",
  "women", "wonder", "word", "work", "worker", "world", "worry", "would", "write", "writer",
  "wrong",
  // Y
  "yard", "yeah", "year", "yes", "yet", "you", "young", "your", "yourself",
  // Z
  "zero",
  
  // Common variations and additional words
  "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "won't", "wouldn't",
  "don't", "doesn't", "didn't", "can't", "couldn't", "shouldn't", "mightn't", "mustn't",
  "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've",
  "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll",
  "she'll", "we'll", "they'll", "that's", "who's", "what's", "here's", "there's", "where's",
  "let's", "who'd", "how's", "that'll", "who'll", "what'll", "where'll",
  
  // Tech/modern words
  "app", "apps", "blog", "blogs", "click", "clicked", "clicking", "clicks", "code", "coded",
  "codes", "coding", "computer", "computers", "computing", "data", "database", "databases", "digital",
  "download", "downloaded", "downloading", "downloads", "email", "emails", "emailed", "emailing",
  "file", "files", "folder", "folders", "google", "googled", "googling", "hack", "hacked",
  "hacker", "hackers", "hacking", "hardware", "icon", "icons", "internet", "laptop", "laptops",
  "link", "linked", "linking", "links", "login", "logins", "logout", "malware", "menu", "menus",
  "mobile", "monitor", "monitors", "mouse", "network", "networks", "networking", "offline", "online",
  "password", "passwords", "pdf", "pixel", "pixels", "platform", "platforms", "plugin", "plugins",
  "podcast", "podcasts", "post", "posted", "posting", "posts", "printer", "printers", "program",
  "programmed", "programmer", "programmers", "programming", "programs", "reboot", "rebooted", "rebooting",
  "router", "routers", "screenshot", "screenshots", "server", "servers", "software", "spam", "spammed",
  "spamming", "startup", "startups", "stream", "streamed", "streaming", "streams", "sync", "synced",
  "syncing", "tablet", "tablets", "tech", "text", "texted", "texting", "texts", "toolbar", "tweet",
  "tweeted", "tweeting", "tweets", "update", "updated", "updates", "updating", "upgrade", "upgraded",
  "upgrades", "upgrading", "upload", "uploaded", "uploading", "uploads", "url", "urls", "usb",
  "user", "users", "username", "usernames", "video", "videos", "viral", "virtual", "virus",
  "viruses", "web", "webcam", "webcams", "webpage", "webpages", "website", "websites", "wifi", "wiki",
  
  // Common suffixes applied
  "working", "worked", "works", "going", "goes", "went", "gone", "coming", "comes", "came",
  "making", "makes", "made", "taking", "takes", "took", "taken", "getting", "gets", "got",
  "seeing", "sees", "saw", "seen", "knowing", "knows", "knew", "known", "thinking", "thinks",
  "thought", "wanting", "wants", "wanted", "using", "uses", "used", "finding", "finds", "found",
  "giving", "gives", "gave", "given", "telling", "tells", "told", "feeling", "feels", "felt",
  "becoming", "becomes", "became", "leaving", "leaves", "left", "putting", "puts", "meaning",
  "means", "meant", "keeping", "keeps", "kept", "letting", "lets", "beginning", "begins", "began",
  "begun", "seeming", "seems", "seemed", "helping", "helps", "helped", "showing", "shows", "showed",
  "shown", "hearing", "hears", "heard", "playing", "plays", "played", "running", "runs", "ran",
  "moving", "moves", "moved", "living", "lives", "lived", "believing", "believes", "believed",
  "holding", "holds", "held", "bringing", "brings", "brought", "happening", "happens", "happened",
  "writing", "writes", "wrote", "written", "providing", "provides", "provided", "sitting", "sits",
  "sat", "standing", "stands", "stood", "losing", "loses", "lost", "paying", "pays", "paid",
  "meeting", "meets", "met", "including", "includes", "included", "continuing", "continues", "continued",
  "setting", "sets", "learning", "learns", "learned", "changing", "changes", "changed", "leading",
  "leads", "led", "understanding", "understands", "understood", "watching", "watches", "watched",
  "following", "follows", "followed", "stopping", "stops", "stopped", "creating", "creates", "created",
  "speaking", "speaks", "spoke", "spoken", "reading", "reads", "allowing", "allows", "allowed",
  "adding", "adds", "added", "spending", "spends", "spent", "growing", "grows", "grew", "grown",
  "opening", "opens", "opened", "walking", "walks", "walked", "winning", "wins", "won", "offering",
  "offers", "offered", "remembering", "remembers", "remembered", "loving", "loves", "loved",
  "considering", "considers", "considered", "appearing", "appears", "appeared", "buying", "buys",
  "bought", "waiting", "waits", "waited", "serving", "serves", "served", "dying", "dies", "died",
  "sending", "sends", "sent", "expecting", "expects", "expected", "building", "builds", "built",
  "staying", "stays", "stayed", "falling", "falls", "fell", "fallen", "cutting", "cuts",
  "reaching", "reaches", "reached", "killing", "kills", "killed", "remaining", "remains", "remained",
  "suggesting", "suggests", "suggested", "raising", "raises", "raised", "passing", "passes", "passed",
  "selling", "sells", "sold", "requiring", "requires", "required", "reporting", "reports", "reported",
  "deciding", "decides", "decided", "pulling", "pulls", "pulled",
  
  // Common adjective forms
  "better", "best", "worse", "worst", "more", "most", "less", "least", "bigger", "biggest",
  "smaller", "smallest", "older", "oldest", "younger", "youngest", "longer", "longest", "shorter",
  "shortest", "higher", "highest", "lower", "lowest", "faster", "fastest", "slower", "slowest",
  "earlier", "earliest", "later", "latest", "easier", "easiest", "harder", "hardest", "larger",
  "largest", "greater", "greatest", "stronger", "strongest", "weaker", "weakest", "newer", "newest",
  "closer", "closest", "further", "furthest", "simpler", "simplest", "clearer", "clearest",
  "darker", "darkest", "lighter", "lightest", "heavier", "heaviest", "thicker", "thickest",
  "thinner", "thinnest", "wider", "widest", "narrower", "narrowest", "deeper", "deepest",
  "cheaper", "cheapest", "richer", "richest", "poorer", "poorest", "safer", "safest",
  
  // Plural forms
  "things", "people", "years", "ways", "days", "men", "women", "children", "worlds", "lives",
  "hands", "parts", "places", "cases", "weeks", "companies", "systems", "programs", "questions",
  "works", "governments", "numbers", "nights", "points", "homes", "waters", "rooms", "mothers",
  "areas", "moneys", "stories", "facts", "months", "lots", "rights", "studies", "books", "eyes",
  "jobs", "words", "businesses", "issues", "sides", "kinds", "heads", "houses", "services", "friends",
  "fathers", "powers", "hours", "games", "lines", "members", "laws", "cars", "cities", "communities",
  "names", "teams", "minutes", "ideas", "kids", "bodies", "informations", "backs", "parents", "faces",
  "others", "levels", "offices", "doors", "healths", "persons", "arts", "wars", "histories", "parties",
  "results", "changes", "mornings", "reasons", "researches", "girls", "guys", "moments", "airs", "teachers",
  "forces", "educations",
  
  // More common words
  "okay", "ok", "yeah", "yes", "no", "hey", "hi", "hello", "bye", "goodbye", "please", "thanks",
  "thank", "sorry", "excuse", "pardon", "welcome", "congratulations", "wow", "oops", "uh", "um",
  "hmm", "ah", "oh", "ooh", "ow", "yay", "boo", "shh", "psst", "ahem", "ugh", "yuck", "meh",
  "awesome", "cool", "nice", "great", "good", "bad", "terrible", "horrible", "wonderful", "amazing",
  "fantastic", "excellent", "perfect", "brilliant", "superb", "outstanding", "incredible", "unbelievable",
  "beautiful", "gorgeous", "pretty", "cute", "lovely", "attractive", "ugly", "hideous", "disgusting",
  "gross", "nasty", "awful", "dreadful", "frightful", "scary", "creepy", "spooky", "weird", "strange",
  "odd", "unusual", "normal", "regular", "typical", "common", "rare", "unique", "special", "ordinary",
  "extraordinary", "remarkable", "notable", "significant", "important", "essential", "crucial", "vital",
  "necessary", "required", "needed", "wanted", "desired", "preferred", "favorite", "beloved", "precious",
  "valuable", "worthless", "useless", "helpful", "useful", "practical", "theoretical", "abstract",
  "concrete", "specific", "general", "broad", "narrow", "wide", "thin", "thick", "deep", "shallow",
  "high", "low", "tall", "short", "long", "brief", "quick", "slow", "fast", "rapid", "swift",
  "sudden", "gradual", "immediate", "eventual", "permanent", "temporary", "constant", "variable",
  "stable", "unstable", "secure", "insecure", "safe", "dangerous", "risky", "careful", "careless",
  "cautious", "reckless", "wise", "foolish", "smart", "stupid", "intelligent", "brilliant", "dumb",
  "clever", "cunning", "naive", "innocent", "guilty", "responsible", "irresponsible", "reliable",
  "unreliable", "trustworthy", "untrustworthy", "honest", "dishonest", "sincere", "fake", "genuine",
  "authentic", "original", "copy", "real", "imaginary", "fictional", "actual", "potential", "possible",
  "impossible", "probable", "improbable", "likely", "unlikely", "certain", "uncertain", "sure", "unsure",
  "confident", "doubtful", "hopeful", "hopeless", "optimistic", "pessimistic", "positive", "negative",
  "neutral", "fair", "unfair", "just", "unjust", "equal", "unequal", "similar", "different", "same",
  "opposite", "contrary", "consistent", "inconsistent", "compatible", "incompatible", "appropriate",
  "inappropriate", "suitable", "unsuitable", "relevant", "irrelevant", "related", "unrelated",
  "connected", "disconnected", "attached", "detached", "separate", "combined", "mixed", "pure",
  "clean", "dirty", "neat", "messy", "organized", "disorganized", "tidy", "untidy", "orderly",
  "chaotic", "calm", "hectic", "peaceful", "violent", "gentle", "rough", "smooth", "soft", "hard",
  "firm", "flexible", "rigid", "stiff", "loose", "tight", "open", "closed", "empty", "full",
  "complete", "incomplete", "finished", "unfinished", "done", "undone", "ready", "unprepared",
  "prepared", "available", "unavailable", "accessible", "inaccessible", "visible", "invisible",
  "obvious", "hidden", "clear", "unclear", "plain", "fancy", "simple", "complex", "complicated",
  "easy", "difficult", "hard", "challenging", "demanding", "effortless", "automatic", "manual",
  "natural", "artificial", "organic", "synthetic", "raw", "processed", "fresh", "stale", "new",
  "old", "young", "ancient", "modern", "contemporary", "traditional", "conventional", "unconventional",
  "standard", "custom", "default", "optional", "mandatory", "voluntary", "compulsory", "free",
  "paid", "expensive", "cheap", "costly", "affordable", "priceless", "worthwhile", "profitable",
  "unprofitable", "successful", "unsuccessful", "effective", "ineffective", "efficient", "inefficient",
  "productive", "unproductive", "active", "inactive", "busy", "idle", "working", "broken", "fixed",
  "damaged", "repaired", "functional", "dysfunctional", "operational", "healthy", "unhealthy", "sick",
  "ill", "well", "fit", "unfit", "strong", "weak", "powerful", "powerless", "mighty", "feeble",
  "energetic", "tired", "exhausted", "refreshed", "awake", "asleep", "alive", "dead", "living",
  "deceased", "born", "unborn", "growing", "shrinking", "expanding", "contracting", "increasing",
  "decreasing", "rising", "falling", "improving", "worsening", "developing", "declining", "advancing",
  "retreating", "progressing", "regressing", "moving", "stationary", "static", "dynamic", "changing",
  "unchanged", "varying", "fixed", "settled", "unsettled", "resolved", "unresolved", "solved",
  "unsolved", "answered", "unanswered", "known", "unknown", "familiar", "unfamiliar", "recognized",
  "unrecognized", "identified", "unidentified", "named", "unnamed", "titled", "untitled", "labeled",
  "unlabeled", "marked", "unmarked", "signed", "unsigned", "sealed", "unsealed", "locked", "unlocked",
  "secured", "unsecured", "protected", "unprotected", "covered", "uncovered", "exposed", "hidden",
  "revealed", "concealed", "shown", "displayed", "presented", "represented", "described", "explained",
  "understood", "misunderstood", "interpreted", "misinterpreted", "translated", "untranslated",
  "written", "unwritten", "typed", "handwritten", "printed", "published", "unpublished", "released",
  "unreleased", "announced", "unannounced", "confirmed", "unconfirmed", "verified", "unverified",
  "validated", "invalidated", "approved", "disapproved", "accepted", "rejected", "admitted", "denied",
  "allowed", "forbidden", "permitted", "prohibited", "legal", "illegal", "lawful", "unlawful",
  "legitimate", "illegitimate", "valid", "invalid", "correct", "incorrect", "right", "wrong",
  "accurate", "inaccurate", "precise", "imprecise", "exact", "approximate", "true", "false",
  "factual", "fictional", "realistic", "unrealistic", "practical", "impractical", "logical",
  "illogical", "rational", "irrational", "reasonable", "unreasonable", "sensible", "nonsensical",
  "meaningful", "meaningless", "significant", "insignificant", "substantial", "insubstantial",
  "considerable", "negligible", "major", "minor", "primary", "secondary", "main", "auxiliary",
  "central", "peripheral", "core", "marginal", "essential", "optional", "fundamental", "superficial",
  "basic", "advanced", "elementary", "intermediate", "beginner", "expert", "amateur", "professional",
  "skilled", "unskilled", "trained", "untrained", "experienced", "inexperienced", "qualified",
  "unqualified", "certified", "uncertified", "licensed", "unlicensed", "authorized", "unauthorized",
  "official", "unofficial", "formal", "informal", "casual", "serious", "playful", "strict", "lenient",
  "harsh", "mild", "severe", "moderate", "extreme", "radical", "conservative", "liberal", "progressive"
]);

// Common misspellings and their corrections
const commonMisspellings = {
  "teh": "the",
  "thier": "their",
  "recieve": "receive",
  "wierd": "weird",
  "definately": "definitely",
  "seperate": "separate",
  "occured": "occurred",
  "untill": "until",
  "wich": "which",
  "becuase": "because",
  "becasue": "because",
  "beleive": "believe",
  "belive": "believe",
  "calender": "calendar",
  "collegue": "colleague",
  "comming": "coming",
  "commitee": "committee",
  "completly": "completely",
  "concious": "conscious",
  "curiousity": "curiosity",
  "decieve": "deceive",
  "dissapear": "disappear",
  "dissapoint": "disappoint",
  "embarass": "embarrass",
  "enviroment": "environment",
  "explaination": "explanation",
  "familar": "familiar",
  "finaly": "finally",
  "foriegn": "foreign",
  "freind": "friend",
  "goverment": "government",
  "governement": "government",
  "grammer": "grammar",
  "happend": "happened",
  "harrass": "harass",
  "immediatly": "immediately",
  "independant": "independent",
  "intresting": "interesting",
  "knowlege": "knowledge",
  "liason": "liaison",
  "libary": "library",
  "lisence": "license",
  "maintainance": "maintenance",
  "mispell": "misspell",
  "neccessary": "necessary",
  "noticable": "noticeable",
  "ocasion": "occasion",
  "occurence": "occurrence",
  "oficial": "official",
  "oportunity": "opportunity",
  "paralel": "parallel",
  "parliment": "parliament",
  "particulary": "particularly",
  "passtime": "pastime",
  "perseverence": "perseverance",
  "personel": "personnel",
  "planing": "planning",
  "posession": "possession",
  "prefered": "preferred",
  "proffessional": "professional",
  "profesional": "professional",
  "pronounciation": "pronunciation",
  "publically": "publicly",
  "realy": "really",
  "reccomend": "recommend",
  "refered": "referred",
  "relevent": "relevant",
  "religous": "religious",
  "repitition": "repetition",
  "resistence": "resistance",
  "responsability": "responsibility",
  "rythm": "rhythm",
  "shedule": "schedule",
  "sieze": "seize",
  "similer": "similar",
  "speach": "speech",
  "strenght": "strength",
  "succesful": "successful",
  "successfull": "successful",
  "suprise": "surprise",
  "tendancy": "tendency",
  "therefor": "therefore",
  "tommorow": "tomorrow",
  "tommorrow": "tomorrow",
  "tounge": "tongue",
  "truely": "truly",
  "unforseen": "unforeseen",
  "unfortunatly": "unfortunately",
  "usefull": "useful",
  "vaccum": "vacuum",
  "vegatable": "vegetable",
  "villian": "villain",
  "wether": "whether",
  "writting": "writing",
  "acheive": "achieve",
  "accross": "across",
  "adress": "address",
  "agressive": "aggressive",
  "alot": "a lot",
  "amature": "amateur",
  "anual": "annual",
  "apparant": "apparent",
  "arguement": "argument",
  "assasinate": "assassinate",
  "basicly": "basically",
  "begining": "beginning",
  "bizzare": "bizarre",
  "boundry": "boundary",
  "buisness": "business",
  "catagory": "category",
  "cemetary": "cemetery",
  "changable": "changeable",
  "cheif": "chief",
  "choosen": "chosen",
  "cieling": "ceiling",
  "colum": "column",
  "comercial": "commercial",
  "comparision": "comparison",
  "compatability": "compatibility",
  "completition": "completion",
  "concensus": "consensus",
  "correspondance": "correspondence",
  "critisism": "criticism",
  "curiculum": "curriculum",
  "definate": "definite",
  "dependant": "dependent",
  "desparate": "desperate",
  "develope": "develop",
  "developement": "development",
  "diffrence": "difference",
  "dilema": "dilemma",
  "disasterous": "disastrous",
  "dispite": "despite",
  "ecstacy": "ecstasy",
  "efficency": "efficiency",
  "eigth": "eighth",
  "embarrasment": "embarrassment",
  "enterance": "entrance",
  "equiped": "equipped",
  "especialy": "especially",
  "excellant": "excellent",
  "excercise": "exercise",
  "existance": "existence",
  "extreem": "extreme",
  "facinate": "fascinate",
  "Febuary": "February",
  "firey": "fiery",
  "flourescent": "fluorescent",
  "fourty": "forty",
  "foward": "forward",
  "freindly": "friendly",
  "fulfil": "fulfill",
  "gaurd": "guard",
  "genious": "genius",
  "gloabal": "global",
  "gratefull": "grateful",
  "guidence": "guidance",
  "happyness": "happiness",
  "heighth": "height",
  "heros": "heroes",
  "hopeing": "hoping",
  "hygeine": "hygiene",
  "ignorence": "ignorance",
  "imaginery": "imaginary",
  "immitate": "imitate",
  "incidently": "incidentally",
  "independance": "independence",
  "indispensible": "indispensable",
  "innoculate": "inoculate",
  "intellegent": "intelligent",
  "interuption": "interruption",
  "irresistable": "irresistible",
  "jellous": "jealous",
  "judgement": "judgment",
  "liesure": "leisure",
  "lenght": "length",
  "lightening": "lightning",
  "lonliness": "loneliness",
  "loosing": "losing",
  "luxery": "luxury",
  "magizine": "magazine",
  "manuever": "maneuver",
  "marraige": "marriage",
  "mathmatics": "mathematics",
  "medeval": "medieval",
  "millenium": "millennium",
  "minature": "miniature",
  "mischevious": "mischievous",
  "mispelled": "misspelled",
  "mountian": "mountain",
  "naturaly": "naturally",
  "neibor": "neighbor",
  "nieghbor": "neighbor",
  "nineth": "ninth",
  "occassion": "occasion",
  "occassionally": "occasionally",
  "occurances": "occurrences",
  "opurtunity": "opportunity",
  "orignal": "original",
  "outragous": "outrageous",
  "parliment": "parliament",
  "particularily": "particularly",
  "pavillion": "pavilion",
  "peacful": "peaceful",
  "peice": "piece",
  "percieve": "perceive",
  "permanant": "permanent",
  "persistant": "persistent",
  "personaly": "personally",
  "persue": "pursue",
  "pharoah": "pharaoh",
  "phenominal": "phenomenal",
  "pigeon": "pigeon",
  "playwrite": "playwright",
  "politican": "politician",
  "posible": "possible",
  "potatos": "potatoes",
  "practicle": "practical",
  "preceed": "precede",
  "preferance": "preference",
  "presance": "presence",
  "privelege": "privilege",
  "probaly": "probably",
  "procede": "proceed",
  "prominant": "prominent",
  "proove": "prove",
  "prophecy": "prophecy",
  "pshycology": "psychology",
  "publicy": "publicly",
  "pursuade": "persuade",
  "questionaire": "questionnaire",
  "readible": "readable",
  "rebelion": "rebellion",
  "receving": "receiving",
  "recognise": "recognize",
  "recuring": "recurring",
  "referance": "reference",
  "relavant": "relevant",
  "remeber": "remember",
  "reminise": "reminisce",
  "repare": "repair",
  "repetion": "repetition",
  "representive": "representative",
  "restaraunt": "restaurant",
  "rediculous": "ridiculous",
  "sacrafice": "sacrifice",
  "safty": "safety",
  "sargent": "sergeant",
  "satisfyed": "satisfied",
  "scarey": "scary",
  "scedule": "schedule",
  "sceince": "science",
  "scissers": "scissors",
  "secretery": "secretary",
  "sence": "sense",
  "sentance": "sentence",
  "seperately": "separately",
  "sergent": "sergeant",
  "sevral": "several",
  "shinning": "shining",
  "sieze": "seize",
  "sincerly": "sincerely",
  "skilfull": "skillful",
  "slite": "slight",
  "sophmore": "sophomore",
  "souvenier": "souvenir",
  "speacial": "special",
  "specificaly": "specifically",
  "specimin": "specimen",
  "sponser": "sponsor",
  "spontanous": "spontaneous",
  "statment": "statement",
  "stomache": "stomach",
  "storys": "stories",
  "strech": "stretch",
  "stubborn": "stubborn",
  "studing": "studying",
  "subconcious": "subconscious",
  "submited": "submitted",
  "substansial": "substantial",
  "substitude": "substitute",
  "succede": "succeed",
  "suficient": "sufficient",
  "sumary": "summary",
  "supercede": "supersede",
  "supposably": "supposedly",
  "surley": "surely",
  "surounding": "surrounding",
  "survay": "survey",
  "survivied": "survived",
  "sware": "swear",
  "sympton": "symptom",
  "technicaly": "technically",
  "temperment": "temperament",
  "tempature": "temperature",
  "terible": "terrible",
  "teritory": "territory",
  "thankfull": "thankful",
  "therfore": "therefore",
  "thesaurus": "thesaurus",
  "tought": "thought",
  "tradegy": "tragedy",
  "transfered": "transferred",
  "traning": "training",
  "triathalon": "triathlon",
  "trists": "trusts",
  "twelth": "twelfth",
  "tyrany": "tyranny",
  "underate": "underrate",
  "untill": "until",
  "unusualy": "unusually",
  "usally": "usually",
  "useing": "using",
  "vaccuum": "vacuum",
  "valuble": "valuable",
  "vandel": "vandal",
  "variaty": "variety",
  "vegitarian": "vegetarian",
  "vehical": "vehicle",
  "vengance": "vengeance",
  "vicious": "vicious",
  "visious": "vicious",
  "visable": "visible",
  "waranty": "warranty",
  "weared": "weird",
  "welth": "wealth",
  "wendsday": "Wednesday",
  "wensday": "Wednesday",
  "wieght": "weight",
  "wierd": "weird",
  "writen": "written",
  "yatch": "yacht",
  "yeild": "yield",
  "youre": "you're",
  "yourselfs": "yourselves"
};

// Check if a word is spelled correctly
function isCorrectlySpelled(word) {
  const lower = word.toLowerCase();
  
  // Skip very short words, numbers, and special characters
  if (word.length < 2 || /^\d+$/.test(word) || /[^a-zA-Z'-]/.test(word)) {
    return true;
  }
  
  // Check common misspellings first
  if (commonMisspellings[lower]) {
    return false;
  }
  
  // Check against dictionary
  return commonWords.has(lower);
}

// Get spelling suggestions for a word
function getSpellingSuggestions(word) {
  const lower = word.toLowerCase();
  const suggestions = [];
  
  // Check if it's a known misspelling
  if (commonMisspellings[lower]) {
    suggestions.push(commonMisspellings[lower]);
  }
  
  // Find similar words using Levenshtein distance
  const similarWords = findSimilarWords(lower, 5);
  suggestions.push(...similarWords);
  
  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 6);
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Find similar words from dictionary
function findSimilarWords(word, limit = 5) {
  const candidates = [];
  const maxDistance = Math.min(3, Math.floor(word.length / 2));
  
  // Only check words of similar length for performance
  for (const dictWord of commonWords) {
    if (Math.abs(dictWord.length - word.length) <= 2) {
      const distance = levenshteinDistance(word, dictWord);
      if (distance <= maxDistance && distance > 0) {
        candidates.push({ word: dictWord, distance });
      }
    }
  }
  
  // Sort by distance and return top matches
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates.slice(0, limit).map(c => c.word);
}

// Find misspelled words in text
function findMisspelledWords(text) {
  const words = text.match(/\b[a-zA-Z'-]+\b/g) || [];
  const misspelled = [];
  
  words.forEach((word, index) => {
    if (!isCorrectlySpelled(word)) {
      // Find the position in the original text
      let pos = 0;
      for (let i = 0; i < index; i++) {
        pos = text.indexOf(words[i], pos) + words[i].length;
      }
      const wordPos = text.indexOf(word, pos);
      
      misspelled.push({
        word,
        index: wordPos,
        length: word.length,
        suggestions: getSpellingSuggestions(word)
      });
    }
  });
  
  return misspelled;
}

// Export for use in content script
if (typeof window !== 'undefined') {
  window.VocabSpellCheck = {
    isCorrectlySpelled,
    getSpellingSuggestions,
    findMisspelledWords,
    commonMisspellings
  };
}

