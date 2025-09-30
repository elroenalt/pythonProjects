import random
wordSet = ([
    {
        "akkr": [
            "us (2 people, accusative)",
            "us (2 people, dative)"
        ]
    },
    {
        "akkar": "us (2 people, genitive)"
    },
    {
        "aldri": "never"
    },
    {
        "aptr": "again"
    },
    {
        "at": "that"
    },
    {
        "barn n.": "kid"
    },
    {
        "bestr": "horse"
    },
    {
        "bíð": "group of men (army)"
    },
    {
        "borg f.": "elevated place"
    },
    {
        "braut": "away"
    },
    {
        "bús n.": "house"
    },
    {
        "dvergr m.": "dwarf"
    },
    {
        "eigi": "don't"
    },
    {
        "eiðr m.": "oath"
    },
    {
        "ek": "I (nominative)"
    },
    {
        "eldr m.": "fire"
    },
    {
        "en": "but"
    },
    {
        "er": "[\"where\",\"which\",\"is\"]"
    },
    {
        "eða": "or"
    },
    {
        "fjall n.": "mountain"
    },
    {
        "flǫgð f.": "witch"
    },
    {
        "friðr m.": "peace"
    },
    {
        "fótr m.": "foot"
    },
    {
        "fǫr f.": "journey"
    },
    {
        "garðr m.": "fence"
    },
    {
        "goð n.": "god"
    },
    {
        "gras n.": "grass"
    },
    {
        "haf n.": "ocean"
    },
    {
        "hann": "he"
    },
    {
        "heimr m.": "home"
    },
    {
        "heðan": "(from) here"
    },
    {
        "hingat": "(come) here"
    },
    {
        "hringr m.": "ring"
    },
    {
        "hugr m.": "mind"
    },
    {
        "hvat": "what"
    },
    {
        "hversu": "how"
    },
    {
        "hér": "(at) here"
    },
    {
        "illa": "bad"
    },
    {
        "jǫrð f.": "earth"
    },
    {
        "kostr m.": "choice"
    },
    {
        "lag n.": "order"
    },
    {
        "land n.": "land"
    },
    {
        "maðr m.": "person"
    },
    {
        "mik": "me (accusative)"
    },
    {
        "mjǫk": "very"
    },
    {
        "mál n.": "[\"speech\",\"business\"]"
    },
    {
        "mér": "me (dative)"
    },
    {
        "mín": "my (genitive)"
    },
    {
        "nú": "now"
    },
    {
        "ok": "and"
    },
    {
        "oss": [
            "us (accusative)",
            "us (dative)"
        ]
    },
    {
        "skip n.": "ship"
    },
    {
        "skǫmm f.": "shame"
    },
    {
        "sonr m.": "son"
    },
    {
        "strǫnd f.": "beach"
    },
    {
        "stuðr m.": "place"
    },
    {
        "svá": "so"
    },
    {
        "vald n.": "control"
    },
    {
        "var": "was"
    },
    {
        "vatn n.": "water"
    },
    {
        "vel": "well"
    },
    {
        "verǫld f.": "world"
    },
    {
        "vindr m.": "wind"
    },
    {
        "vinr m.": "friend"
    },
    {
        "vit": "we (nominative)"
    },
    {
        "vǫllr m.": "valley"
    },
    {
        "vár": "our (genitive)"
    },
    {
        "vér": "we (nominative)"
    },
    {
        "áðr": "before"
    },
    {
        "ætt f.": "[\"family\",\"direction\"]"
    },
    {
        "álfr m.": "elf"
    },
    {
        "þangat": "(to) there"
    },
    {
        "þar": "(at) there"
    },
    {
        "þat": "it"
    },
    {
        "þaðan": "(from) there"
    },
    {
        "þá": "then"
    },
    {
        "þó": "though"
    },
    {
        "Þorskr m.": "cod"
    },
    {
        "ǫld f.": "age"
    }
])
def get_word_and_def(word_dict):
    """Helper to extract the word and definition from the dictionary item."""
    word = list(word_dict.keys())[0]
    definition = word_dict[word]
    if isinstance(definition, list):
        # Join multiple definitions for display
        definition = ", ".join(definition)
    elif isinstance(definition, str) and definition.startswith('["') and definition.endswith('"]'):
        # Clean up the string representation of a list
        definition = definition.strip('[]').replace('"', '').replace('\\','')
    return word, definition
def newQuestionSet(wordSet, amount):
    # Ensure 'amount' doesn't exceed the number of words available
    if amount > len(wordSet):
        amount = len(wordSet)
    
    # Randomly select unique words for the questions
    questions_words = random.sample(wordSet, amount)
    
    sets = []
    
    # Create a list of all potential decoy words (the whole wordSet)
    decoy_pool = list(wordSet)
    
    for word_dict in questions_words:
        # The word being questioned
        correct_word, correct_def = get_word_and_def(word_dict)
        
        # Select 3 unique decoy definitions
        # Filter the decoy pool to exclude the current word_dict
        filtered_decoy_pool = [item for item in decoy_pool if item != word_dict]
        
        # Select 3 other random words from the filtered pool
        # Handle case where there might be fewer than 3 decoys
        num_decoys = 3
        if len(filtered_decoy_pool) < num_decoys:
             num_decoys = len(filtered_decoy_pool)
             
        decoys = random.sample(filtered_decoy_pool, num_decoys)
        
        # Build the options list with the correct definition and the decoys' definitions
        options = []
        
        # Extract and format the definitions for the decoys
        decoy_definitions = [get_word_and_def(d)[1] for d in decoys]
        
        # Combine the correct definition with the decoy definitions
        all_options_defs = [correct_def] + decoy_definitions
        
        # Shuffle the options and find the new index of the correct answer
        random.shuffle(all_options_defs)
        corPos = all_options_defs.index(correct_def)
        
        set = {
            'question': correct_word,  # The word the user has to define
            'options': all_options_defs,
            'corIndex': corPos  # The 0-indexed position of the correct answer
            'dir': radom.random
        }
        sets.append(set)
    return sets

            


def askQuestion(question):
    print(question.question)
    questions = len(question.options)
    for i in range(0,questions):
        print(f'{i+1}: {question.options[i]}')
    else:
        print(f'enter an Number beetwen 0 and {questions} ')
    userInput = input()
    if int(userInput) == question.corIndex:
        print('yay <_>')
    else:
        print('wrong ):')

questionSet = newQuestionSet(wordSet,4)
print(questionSet)
