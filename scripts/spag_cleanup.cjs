// Conservative corrections to the searchable excerpts copied from older write-ups.
// Plot and pronoun questions are left for editorial review.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'trails.json');
const trails = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// These two source seasons were written in all capitals. Sentence case also
// makes their long recaps readable in the cards and expanded view.
const recaps = {
  '2023-winter-1': 'You join Dr Winter’s scheme to protect the town against Father Platmas and investigate stolen purple diamant. The clues lead to Spectre, who admits borrowing it without permission. White diamant appears to be the way to stop Father Platmas, so you find a sample and take it to Winter. You then discover Winter is using the crisis to fund a massive new lab rather than solve the problem. Winter destroys the white diamant sample.',
  '2023-winter-2': 'Littlefield wants Jonas to adopt them. You offer to help and even approach Pius, but Littlefield cannot join the Church until they are emancipated from their parents. Perigate eventually reclassifies Littlefield as printer paper, allowing JONACO to adopt them.',
  '2023-winter-3': 'Hogwood has been chased out of the cinema. A team of teenagers and a dog sent to help is found dead, but the yeti involved only wants Hogwood to watch their film and give it a comedy award. Hogwood, however, insists on making art.',
  '2023-winter-4': 'Pocket receives a puppet and believes it came from a future love interest. Hogwood denies sending it, while Pocket’s Jumble profile shows an interdimensional error. You discover the Council of Pockets, made up of counterparts from across the multiverse. The puppet wants to become mayor of the universe, has attacked RoboDJ and is now coming for Pocket. You warn Pocket about the danger and advise destroying the puppet with fire.',
  '2023-winter-5': 'Sparks asks for help trapping Terrence, but someone has already triggered the trap at the squat. Terrence and Hustlepus University seem involved, though Terrence says the JIA is really after Sparks. Madame Mechanica has foretold that Sparks will play Jonas in the Jonativity. You learn Sparks needs to work out and teach the group a new exercise plan.',
  '2023-winter-6': 'Datchery envies Father Platmas’s business model and is experiencing strange cravings. RoboDoc tells you about another Santa who died from an explosive bowel disorder. Datchery is turning into Platmas and could face the same fate. You advise destroying the wish receipt to stop the transformation.',
  '2023-winter-7': 'Perigate’s parents are in town, disguised as staplers. You track them down and learn they are disappointed in their child and trying to set Perigate up with Dr Winter. Winter turns the parents into marbles, and you return them to Perigate.',
  '2023-winter-8': 'Someone has trashed the Undertakers and covered it in green fur. You hear about the Gronch and its cereal, then discover JONACO’s involvement. A man called Elis is slowly transforming into the Gronch. RoboDoc told him to hide in a coffin, so you let Halloway know about the hidden guest.',
  '2023-winter-9': 'A model of Spectre and Vox’s office appears, and Spectre worries that the model maker has returned for Vox. You join their fan club and find fiction by Bunk wishing Vox dead. Bunk has trapped Vox in a model in the Hall of Art. You alert Spectre that Bunk is in the mirrors so they can free her.',
  '2023-winter-10': 'A painting of Platman in the Hall of Art has been defaced. The Questioner is suspected, but Cogwright says they are being framed. Your investigation points to the Matchmaker: Cogwright’s mother, who wants to bring Platman and the Questioner together.',
  '2023-winter-11': 'You intercept a Videomatic from Furbish to Deputy P, Perigate, saying that the terms are agreed and a reply is expected. Perigate is working for Terrence and wants out. Terrence appeals to Furbish and threatens Phantom Peak with a special parcel. You try to intercept it, but Littlefield has already sent it on.',
  '2023-special-3': 'You find a hidden poster from Madame Mechanica and secretly collect Pocket’s “autograph” at London Film and Comic Con for Mechanica’s rank-two assistant, Cogwright. Madame Mechanica then uses the autograph to rob Pocket.',
  '2023-spring-8': 'Hogwood is upset when Boarbark wins best film at the festival. You discover that Boarbark has been using a JonaCamera, which causes memory loss. Hogwood and Boarbark are the same person: the camera made Hogwood forget they were working under a pen name.',
  '2023-autumn-5': 'Perigate is running Terence the Talking Platypus’s campaign. Terence promises to leave Sparks alone, but the kindness is a trick intended to make a demon target Sparks. To save Sparks, you must insult them.',
  '2024-spring-1': 'Rexford has lost Chrono, Platman’s dog. Your search reveals that Chrono travelled back in time and was Rexford’s childhood pet all along.',
  '2024-spring-2': 'Halloway asks you to identify their late mentor, Master Bones, so they can be laid to rest under their real name. An axiomatic watch leads you to Mason Briggs, Jonas’s mentor and a co-founder of JONACO. Jonas gave Briggs the watch as a gift.',
  '2024-spring-3': 'An advert for a Fear Finder targets Dr Winter. You investigate its maker, the Moderately Attractive Ghost Collective, and learn that Sparks built the machine using brain pills. The dreams caused by the pills are more sinister than expected. Further investigation points to Furbish, who wants to team up with Winter. Winter proposes splitting the town fifty-fifty.',
  '2024-spring-4': 'Datchery buys an illegal mystery box that appears to have been returned to its sender. The seller points you to Pius and RoboDoc, who direct you to a crate behind the Hall of Art. It holds a broken egg: a Bureausaur, an accounting dinosaur, was placed inside by Platman after a misunderstanding. You tell Datchery so they can help the creature escape during the closing ceremony.',
  '2024-spring-5': 'Hogwood has fallen for a masked man. You find his Jumble profile and try to get a ticket to the Masked Lovers Ball. The man, Alvin Sheldrake, actually wants Hogwood’s help finishing his film, whose script is hidden under the floorboards. You help Hogwood complete it.',
  '2024-spring-6': 'Littlefield has lost their pet rock. A note on MonsterMon paper sends you to train for a battle, and Sparks gives you your first creature. You learn that Little Rock, Littlefield’s pet, killed Dash and cannot be beaten by your current team. You trade with Spectre for a paranormal type and defeat Little Rock, but the rock dies. You find another rock and persuade Littlefield that their pet has returned.',
  '2024-spring-7': 'JonAssist labels you a tech nerd, so you enter an IT contest with KLACKY. Spectre assigns you to repair their Phrenograph for the Festival of Innovation. Other devices, including RoboDoc, are also malfunctioning because KLACKY has gone rogue. You try to reach Jim for help, only to learn that he is dead. Further clues reveal that KLACKY is a demon named Migas. You broker peace between Migas and Spectre, although it may cost Cogwright a chance at the festival’s grand prize.',
  '2024-spring-8': 'The prince from Barrow on the Hill has been turned into a sugar cube, and Pocket asks for help. Hogwood shows you how the Glucuber works, along with a jar of other transformed friends. A wizard is behind the attack. Dr Winter agrees to make a somewhat functional clone of the prince for Pocket.',
  '2024-spring-9': 'Perigate asks for help with a terrifying clown called That. Balloons lead you to the squat, where you learn Hogwood may be the next target. The Amazing Eunice was once beaten by a group of children led by young Perigate. You discover that Perigate has clownitis, a condition that causes frightening clown hallucinations, and that Hogwood and Datchery were among those children. A red nose is the cure. You tell Perigate that you destroyed the interdimensional spider.',
  '2024-spring-10': 'Pius’s invention, Prostlebot, is accused of murder. A Saloon article, a re-enactment and evidence from Perigate lead you to blood that turns out to be fake. A recording from the Church reveals that the Platypope framed Prostlebot as a marketing ploy. You tell Pius what you found.',
  '2024-spring-11': 'Littlefield spots something flashing Morse code in the sky. A Videomatic clue reveals Operation Moonshot, a plan that could realign the balance of the universe. Pocket has heard that it involves two halves of something, one on Earth and one above. Pocket gives you a card in return for your silence.',
  '2024-summer-4': 'Pocket has killed Chonky Chuck, Jonas’s horse, and now faces a dispute with Jacques the Jock. You try offering Jacques cheese, but it causes offence because of the Cheese Wars. Jacques demands Chonky Chuck’s resurrection. Krazy Keith directs you to Littlefield, whose attempt produces a moth-horse that attacks Revenant Canyon. You advise Pocket to call the mayor to restore peace, leading to a dance at the festival’s close.',
  '2024-summer-3': 'Spectre asks you to represent him in a tax case, but you discover the summons is fake and its supposed issuer is dead. A group of demon raccoons led by Fritz has stolen the Phrenograph and taken a device from RoboDoc that they intend to use as a bomb. You locate the bomb in the mirrors and help Spectre disarm it.',
  '2024-summer-5': 'Perigate’s parents send clown swimwear, although Perigate fears clowns and cannot swim. A Videomatic reveals that they have signed Perigate up for Skytanic to revisit past failures. You obtain a fake obituary from Halloway, but the parents are not fooled. Sparks explains how KLACKY can steer Skybergs into the Skytanic. You also learn that Perigate’s parents have left a gift and tell Perigate where to find it.',
  '2024-summer-11': 'Sparks leads you to a Videomatic from Dr Jorum, who has crash-landed on the moon. Jorum fears that something is following them. Rexford recognises the situation from an Adventures of Platman episode, so you ask Platman for help. This leads to Operation Moonshot, a plan that may realign the universe. Pocket knows it involves two halves of something, one below and one above, and gives you a card to keep quiet.',
  '2024-autumn-1': 'Perigate wants to fail JASA induction to avoid going to space, but Pocket sees through your attempts. Copper suggests that joining the Resistance might anger JONACO and asks Perigate to destroy the Statue of Masculinity. You use an orbital strike, but Lovehart declares the result good for Jonas and promotes Perigate to Space Supervisor. You tell Perigate about the promotion and the trip to space.',
  '2024-autumn-2': 'Spectre asks you to collect money owed by the high-society figure Alfonse. You forge credentials with KLACKY, get an invitation from Datchery and find that Alfonse’s chest has exploded. An alien called Xeno is in the vents and needs Spectre’s help recovering an egg. You collect it from the Jonapost and bring it to Spectre, who can take it into space and help Xeno’s species.',
  '2024-autumn-7': 'Dr Winter suspects an alien shape-shifter is loose in town. CCTV takes you to the Jonagraph, where Perigate reports a strange bell pattern. A message points to Graham Bark, whose attempt to become half human and half platypus went wrong. Graham drew the idea from The New Adventures of Jonas. Spectre and Vox help you make contact through the mirrors, but when you ask Winter for help, Winter decides to destroy Graham’s goo form instead.',
  '2024-autumn-8': 'Pocket has activated a self-destruct sequence but suspects Terence. You learn that Terence has been captured for trying to blow up the moon and join Hustlepus University to speak to him. Terence points you to a story about Pocket’s supposed curse. The clues lead to Furbish, who predicted the countdown and left a way to cancel it. You find a crown that helps Pocket pull a sword from a box and end the threat.',
  '2024-autumn-9': 'Copper wants a new leader for the Resistance and first asks you to fire Sparks. Platman seems to have the right qualities, but a grave raises doubts. Rexford suggests Terence instead, provided you help him escape JONACO’s five-star prison. After the breakout, Terence recommends a rebrand. You realise Copper is the best candidate and persuade them to lead.',
  '2024-winter-4': 'Hogwood asks you to investigate the murder of Todrick the Toad. Todrick left everything to Lady Oinkerton, whose interrogation points to Datchery. Oinkerton is then killed too. Sherlock Bones helps you uncover the culprit: Mr Knuckles, an actor from Hogwood’s films. Jealous of the other puppets, Mr Knuckles plans to attack Hogwood next. You warn Hogwood and confront the killer.',
  '2024-winter-6': 'Littlefield asks you to deliver a letter to Perigate from their parents, who want to replace them. The new Perigate is a dog that has beaten the original at lacrosse and taken over their Jumble dating profile. After you win a JONACO Rhythm Revolution challenge, the dog reveals that they are a double agent working against the parents. The dog sends Perigate a gift: a severed finger.',
  '2024-winter-1': 'Sparks has a song stuck in their head: the Ear Worm is back. Bellamy points you to a DojaPlat music video, and Spectre helps you track down its performer. DojaPlat is Terence in a wig. He caught a Hum Bug from Pius, and you find its nest in a Jonabot Jr. game. You defeat it with the Ear Worm song “Platypus in the Snow.”',
  '2024-winter-9': 'Spectre suspects that Jonatine protein powder is making him ill. RoboDoc sends a sample to Dr Winter, who detects a signal: raccoons have built a miniature submarine and entered Spectre’s body. Datchery spots one of them in town. With KLACKY’s help, you guide Walter the Raccoon out through Spectre’s mouth before the submarine returns to full size.',
  '2025-spring-4': 'A targeted television advert leads you to a fan club that Copper is using as cover for a Green Diamant heist. Pocket appears to have the stone, but Terence has it, then Sparks steals it. Sparks asks you to deliver it to a Resistance contact, Datchery, who throws it in the lake to keep it from the JIA. Copper reveals that this stone was a fake and that the real Green Diamant is already safe.',
  '2025-spring-8': 'Lovehart wants Sherlock Bones evicted, but he is investigating Meowiarty and a stolen painting. Meowiarty dies after trying to warn Bones about an attacker. Clues from the autopsy and a Picture House film lead you to the Jonapost, where the painting is hidden. You discover that Dogtor Watson plotted to kill Bones. You warn Lovehart and Bones, then watch Bones confront Watson at Reichebark Falls.',
  '2025-spring-11': 'Spectre asks what Green Diamant is and where it came from. A town competition leads you to a Videomatic explaining that the substance can transform matter and, in sufficient quantities, the world itself. Furbish warns that Jonas has the means to bring about the Great Undoing. You report back to Spectre, who may need a great deal of white diamant to counter the green.',
  '2025-summer-1': 'Pius’s fundraising magic trick goes wrong when Terence vanishes into the void. You join the Magicians’ Guild, decode its instructions and learn that Kappa can help. Pius’s brother Brutus staged the disappearance and has been promoting a fake Egg of Truth. After reporting Brutus to JONACO, you enter Terence’s name into KLACKY and retrieve him through the Quantum Mailbox. He is flattened to fit, but his immortality means he will recover.',
  '2025-summer-7': 'Hogwood’s new film about Todrick the Toad lacks a compelling secret, so you investigate Todrick’s past. Beardy Hamm may have been a lover, and Lady Oinkerton has tried to contact Todrick from beyond the grave. Clues about Project Toad show that Todrick is still alive and has been puppetising people. Mr Knuckles warns that Hogwood’s film may make Hogwood the next target. You warn Hogwood and calm Todrick with applause.',
  '2025-summer-9': 'Giffard asks you to find and destroy a musical about their father, Furbish. Felicia Smith won a copy but has died, and the recording has passed through several hands. Clues from Sergeant Sausage lead you back to Furbish. Copper has been hiding him since he faked his death in the blimp crash, and Furbish has turned himself into a puppet. You persuade Giffard to shelter him.',
  '2025-summer-10': 'Perigate asks you to open a mysterious box. A book and film about their family lead you to their parents, who say the box was delivered by mistake. Their mail carrier is trapped in a web with a copy of Jonanji, a game that warps reality. After surviving the game’s challenges and following a clue from another victim, you learn that Phantom Peak will become the board unless the game ends. Datchery has the key to the box. You take it to Perigate and finish the game.',
  '2025-summer-11': 'Dr Winter hires you to investigate a photograph of Winter and Jonas together, despite their never having met. Terence denies creating it, while KLACKY says the image is from ten years in the future. A message from future Winter and a code for Terence’s game lead to a film about JONACO’s planned Manifestor, which could tear time apart and destroy the town. Future Winter asks you to persuade present Winter to scrap the plans. You succeed by mentioning the Banana Split Incident.',
  '2025-summer-12': 'Furbish has returned as a puppet and suspects that Phantom Peak’s history is being altered. You ask Pius about a brother they cannot clearly remember, then investigate a missing person called Mr Kim. Lovehart has forgotten Kim too. The Resistance removed Kim, and JONACO now plans to undo people as well as events. A target list includes Nethersole and Lady Oinkerton. Stickler has been ordered to wipe the memories of anyone who remembers the changes. You receive a card in return for your silence.'
};

const commonFixes = [
  [/\bjonaco\b/gi, 'JONACO'],
  [/\bJonacola\b/g, 'JonaCola'],
  [/\bRobodoc\b/g, 'RoboDoc'],
  [/\bKlacky\b/g, 'KLACKY'],
  [/\bRacoon\b/g, 'Raccoon'],
  [/\bracoon\b/g, 'raccoon'],
  [/\bMechnica\b/g, 'Mechanica'],
  [/\bHpgwood\b/g, 'Hogwood'],
  [/\bDatcgery\b/g, 'Datchery'],
  [/\bLITRLEFIED\b/g, 'LITTLEFIELD'],
  [/\bROUGE\b/g, 'ROGUE'],
  [/\bINTERDIMENTIONAL\b/g, 'INTERDIMENSIONAL'],
  [/\bneutalise\b/g, 'neutralise'],
  [/\bJonahedeon\b/g, 'Jonahedron'],
  [/\bHogwoods\b/g, 'Hogwood’s'],
  [/\bHalloways\b/g, 'Halloway’s'],
  [/\bPerigates\b/g, 'Perigate’s'],
  [/\bRexfords\b/g, 'Rexford’s'],
  [/\bDr Winters\b/g, 'Dr Winter’s'],
  [/\bWinters Lab\b/g, 'Winter’s lab'],
  [/\bSpector\b/g, 'Spectre'],
  [/\bPInkerton\b/g, 'Pinkerton'],
  [/\bbrutUS\b/g, 'Brutus'],
  [/\bTurms out\b/g, 'Turns out'],
  [/\bYou yet Pius know\b/g, 'You let Pius know'],
  [/\bthere is 2 halves\b/g, 'there are two halves'],
  [/\bThere a new hot toy\b/g, 'There’s a new hot toy'],
  [/\bYou got to Lovehart\b/g, 'You go to Lovehart'],
  [/\bSomeone was stolen it\b/g, 'Someone stole it'],
  [/\bto trying tricking\b/g, 'to trick'],
  [/\bto a trying tricking\b/g, 'to trick'],
  [/\bthe their registry\b/g, 'their registry'],
  [/\bClimatic end\b/g, 'climactic end'],
  [/\bclimatic end\b/g, 'climactic end'],
  [/\bReenactment\b/g, 're-enactment'],
  [/\bJumBle\b/g, 'Jumble'],
  [/\bGifford\b/g, 'Giffard'],
  [/\bTerrence\b/g, 'Terence'],
  [/\bTerrance\b/g, 'Terence'],
  [/\bSimpbury\b/g, 'Simpsbury'],
  [/\bBeardy Ham\b/g, 'Beardy Hamm'],
  [/\bJonassist\b/g, 'JonAssist'],
  [/\bcos\b/g, 'because'],
];

const specificFixes = {
  '2022-launch-4': [['the one who runs the Jonagraph', 'the person who runs the Jonagraph.']],
  '2022-launch-5': [['DR Winter', 'Dr Winter'], ['diamant based', 'diamant-based']],
  '2022-launch-6': [['Hogwood’s project!', 'Hogwood’s project.']],
  '2022-launch-7': [['in fact its someone Jonas is hiding', 'but it is someone Jonas is hiding.']],
  '2022-launch-8': [['Its Rexford', 'It is Rexford']],
  '2022-launch-10': [['pocket by jonas', 'Pocket by Jonas']],
  '2022-launch-12': [['Ended up creating', 'You end up creating']],
  '2022-launch-13': [['Pockets CLONE', 'Pocket’s clone']],
  '2022-autumn-1': [['the Djinn in disguise', 'the djinn in disguise']],
  '2022-autumn-4': [['Copper’s Grandfather', 'Copper’s grandfather']],
  '2022-autumn-6': [['He nows calls', 'He now calls']],
  '2022-autumn-8': [['Pockets watch', 'Pocket’s watch'], ['a ghost-', 'a ghost —']],
  '2022-autumn-11': [['accountant, Stickler', 'accountant. Stickler']],
  '2022-autumn-12': [['helped Madam Mechanica', 'You help Madame Mechanica']],
  '2022-winter-4': [['Nethersoles help', 'Nethersole’s help']],
  '2022-winter-7': [['tasks you to getting', 'tasks you with getting']],
  '2022-winter-8': [['the actually sentient bots', 'the sentient bots']],
  '2022-winter-12': [['diamant want', 'diamant wand']],
  '2023-spring-2': [['Public Enemy NO1', 'public enemy No. 1'], ['There’s posters', 'There are posters']],
  '2023-spring-4': [['group called fupa', 'group called FUPA']],
  '2023-spring-7': [['you discover they GhoulBusters are', 'you discover the GhoulBusters are']],
  '2023-spring-9': [['revenge!.', 'revenge!']],
  '2023-spring-10': [['Madame Mechnica', 'Madame Mechanica']],
  '2023-summer-7': [['it is was revealed', 'it was revealed']],
  '2023-autumn-7': [['eventually you learn', 'Eventually, you learn']],
  '2023-autumn-9': [['who has seems to have gone somewhere', 'who seems to have gone somewhere']],
  '2023-autumn-11': [['has sent send Spectre', 'has sent Spectre']],
  '2024-summer-1': [['the same on day', 'the same day']],
  '2024-summer-3': [['a authorised judge', 'an authorised judge']],
  '2024-summer-5': [['The only way for to her to avoid it', 'The only way for her to avoid it']],
  '2024-summer-6': [['Jonas’s parent are in trouble', 'Jonas’s parents are in trouble']],
  '2024-summer-7': [['And this this one', 'This one']],
  '2024-summer-8': [['You cant get', 'You can’t get']],
  '2024-summer-10': [['Halloways old camp mate', 'Halloway’s old camp mate']],
  '2024-autumn-2': [['Spectres help', 'Spectre’s help']],
  '2024-autumn-5': [['a NDA', 'an NDA'], ['they’re were just acting', 'they were just acting']],
  '2024-autumn-7': [['it’s refers', 'it refers'], ['help do you ask', 'help, so you ask']],
  '2024-autumn-9': [['consider it of you help', 'consider it if you help']],
  '2024-autumn-10': [['Sherrif', 'Sheriff']],
  '2024-autumn-11': [['his speaks to him', 'his meteor speaks to him']],
  '2025-spring-2': [['the their registry', 'their registry']],
  '2025-spring-4': [['try trying tricking', 'try to trick'], ['a fake the made', 'a fake they made']],
  '2025-spring-9': [['Winters lab', 'Winter’s lab'], ['Turbos part', 'Turbo’s part']],
  '2025-summer-2': [['they been using', 'they have been using']],
  '2025-summer-5': [['You got to Lovehart', 'You go to Lovehart'], ['Rexfords’s', 'Rexford’s']],
  '2025-summer-9': [['Someone was stolen it', 'Someone stole it']],
  '2025-summer-12': [['to Sticker', 'to Stickler'], ['tasked Sticker', 'tasked Stickler']],
};

const titleFixes = {
  '2022-autumn-1': 'Littlefield’s Letter',
  '2022-autumn-5': 'Horror by Hogwood',
  '2023-autumn-4': 'Five Nights at RoboDJ’s',
};

// Character pronouns follow the user's current guidance. Names are repeated
// where a mechanical they/them swap would leave the subject unclear.
const pronounFixes = {
  '2022-launch-1': [['But he needed', 'But they needed']],
  '2022-launch-3': [['and he uploaded his mind', 'and they uploaded their mind'], ['He haunts them', 'The father haunts them']],
  '2022-launch-13': [["and he's much better", 'and the clone is much better']],
  '2022-launch-14': [['her pet', 'their pet'], ['he was actually taken prisoner', 'the pet was actually taken prisoner']],
  '2022-autumn-6': [['He now calls himself Gerald', 'Rexford now goes by Gerald']],
  '2022-autumn-10': [['believing she was pranked', 'believing they were pranked'], ['get her attention', 'get Perigate’s attention']],
  '2022-autumn-13': [['Datchery’s Grandfather turns out to have buried his grandson', 'Datchery’s grandfather turns out to have buried Datchery']],
  '2022-winter-1': [['He punched the ghost', 'Winter punched the ghost']],
  '2022-winter-3': [["he's here to break out", 'Platman is here to break out'], ['aiding his escape', 'aiding Father Platmas’s escape']],
  '2022-winter-5': [['her lamp light switch', 'their lamp light switch']],
  '2023-spring-2': [["She’s no longer needed", 'Zenia is no longer needed']],
  '2023-spring-3': [['at his church', 'at the church'], ['on his behalf', 'on their behalf']],
  '2023-spring-4': [['his best friend', 'his best friend'], ["He's alive", 'He is alive']],
  '2023-spring-8': [['her nemesis', 'their nemesis'], ["she’s been using", 'they have been using'], ['her pen name', 'their pen name']],
  '2023-summer-5': [['examine their old office', 'examine his old office'], ['Furbish is behind his own cult', 'Furbish is behind his own cult']],
  '2023-summer-6': [["locals won't talk to him", 'locals will not talk to Jonas'], ['talk to pocket', 'talk to Pocket'], ['Now he is looking', 'Now Jonas is looking'], ['something he calls', 'something Jonas calls']],
  '2023-summer-8': [['proof of his Platman connections', 'proof of their Platman connections'], ["he’s worried", 'Rexford is worried'], ['He sends you', 'Rexford sends you']],
  '2023-summer-9': [['He wants you', 'Winter wants you'], ["He's started a scheme", 'Terence has started a scheme']],
  '2023-summer-11': [['(Which he does', '(Which Rexford does']],
  '2023-autumn-2': [['a speech he gave', 'a speech they gave']],
  '2023-autumn-3': [['rumors about him', 'rumours about Winter'], ['crowning him', 'crowning Winter']],
  '2023-autumn-8': [["she's hallucinating", 'they are hallucinating'], ['You warn her', 'You warn Hogwood']],
  '2023-autumn-9': [["she's moved", 'they have moved']],
  '2023-autumn-10': [['what she did', 'what they did']],
  '2023-winter-9': [['free her', 'free Vox']],
  '2023-winter-8': [['A man called Elis', 'A person named Elis'], ['told him to hide', 'told Elis to hide']],
  '2023-special-1': [['his evil schemes', 'their evil schemes']],
  '2023-special-2': [['what he believes', 'what they believe']],
  '2024-spring-5': [['a masked man', 'a masked person'], ['his Jumble profile', 'their Jumble profile'], ['The man, Alvin Sheldrake', 'Alvin Sheldrake'], ["finishing his film", 'finishing a film'], ["You help Hogwood complete it", 'You help Hogwood complete the film']],
  '2024-spring-7': [['Spectre assigns you to repair their Phrenograph', 'Spectre assigns you to repair his Phrenograph'], ['that he is dead', 'that Jim is dead']],
  '2024-summer-1': [['she keeps remembering', 'they keep remembering'], ['She asked', 'They asked']],
  '2024-summer-4': [['he KILLED CHONKY CHUCK', 'Pocket KILLED CHONKY CHUCK'], ['He said only', 'Jacques says only']],
  '2024-summer-5': [['Her parents', 'Their parents'], ['from her parents', 'from their parents'], ['It appears her parents', 'It appears their parents'], ['signed her up', 'signed Perigate up'], ['for her to avoid it', 'for Perigate to avoid it'], ["she's dead", 'Perigate is dead'], ["her parents", 'their parents'], ["left her a present", 'left Perigate a present']],
  '2024-summer-7': [['She has a map and she thinks her father', 'They have a map and think their father'], ["her father's ashes", 'their father’s ashes']],
  '2024-summer-11': [['He thinks something is following him', 'Jorum thinks something is following them'], ["he says it's", 'Jorum says it is']],
  '2024-autumn-1': [['You let her know she’s going to space', 'You tell Perigate they are going to space']],
  '2024-autumn-2': [['getting their money', 'getting his money'], ['owes spectre money', 'owes Spectre money'], ['find his chest exploded', 'find that Alfonse’s chest has exploded'], ['needs Spectre’s help', 'needs Spectre’s help'], ['take it to spectre', 'take it to Spectre']],
  '2024-autumn-3': [['her stolen doll', 'their stolen doll'], ['she suspects', 'they suspect'], ['(her mother!)', '(their mother!)'], ['she wants Hogwood', 'Grigonna wants Hogwood']],
  '2024-autumn-4': [['all her Billy Bonka chocolate', 'all their Billy Bonka chocolate']],
  '2024-autumn-7': [['She says', 'Perigate says'], ['turns him into the shape shifter', 'turns Graham into the shape-shifter'], ['his Mama', 'their mama']],
  '2024-autumn-9': [['talk her into taking', 'talk Copper into taking']],
  '2024-autumn-10': [['She shot the bandit', 'Halloway’s mother shot the bandit']],
  '2024-autumn-11': [['his meteor speaks to him', 'a meteor speaks to Pius']],
  '2024-winter-4': [['You find her album', 'You find Oinkerton’s album'], ['learn she told JIA Datchery did it', 'learn Oinkerton told the JIA that Datchery did it'], ["(He had it coming!)", '(The victim had it coming!)']],
  '2024-winter-5': [['his Simp Cave', 'Simpbury’s cave'], ['You find him', 'You find Simpbury']],
  '2024-winter-6': [['from her parents', 'from their parents']],
  '2025-spring-10': [['but she can make counter curses', 'but Copper can make counter-curses']],
  '2025-summer-4': [['bring her back', 'bring Madame Mechanica back']],
  '2025-summer-7': [['learn she tried', 'learn Oinkerton tried']],
  '2025-summer-9': [['it killed her', 'it killed Felicia'], ['faking their death', 'faking his death'], ['they have turned themselves into a puppet', 'he has turned himself into a puppet'], ['take them to a new hiding place', 'take Furbish to a new hiding place'], ['let them stay with them', 'let Furbish stay with Giffard']],
  '2025-summer-10': [['contact her parents', 'contact their parents']],
  '2025-summer-11': [['And he suspects Terence', 'Winter suspects Terence'], ['Winter said he would join', 'Winter said they would join']],
};

function summarise(recap) {
  if (recap.length <= 205) return recap;
  return recap.slice(0, 205).replace(/\s+\S*$/, '').replace(/[\s,;:–-]+$/, '') + '…';
}

for (const trail of trails) {
  if (trail.id.startsWith('2025-autumn') || trail.id.startsWith('2025-winter') || trail.id.startsWith('2026-finale')) continue;
  if (Object.hasOwn(titleFixes, trail.id)) trail.title = titleFixes[trail.id];
  if (Object.hasOwn(recaps, trail.id)) trail.searchText = recaps[trail.id];
  for (const [find, replace] of commonFixes) trail.searchText = trail.searchText.replace(find, replace);
  for (const [find, replace] of specificFixes[trail.id] || []) trail.searchText = trail.searchText.replaceAll(find, replace);
  for (const [find, replace] of pronounFixes[trail.id] || []) trail.searchText = trail.searchText.replaceAll(find, replace);
  trail.searchText = trail.searchText.trim().replace(/\.{4,}$/g, '.').replace(/(?<!\.)\.\.(?!\.)/g, '.').replace(/!{2,}/g, '!');
  if (!/[.!?…]$/.test(trail.searchText)) trail.searchText += '.';
  for (const [find, replace] of commonFixes) {
    trail.title = trail.title.replace(find, replace);
    trail.mainCharacter = trail.mainCharacter.replace(find, replace);
    trail.otherCharacters = trail.otherCharacters.map(name => name.replace(find, replace));
  }
  trail.summary = summarise(trail.searchText);
}

const specialPdf = 'pdfs/2023/2023 Special Event Trail Write Ups.pdf';
if (!trails.some(trail => trail.id === '2023-special-4')) {
  const eventTrail = {
    id: '2023-special-4', year: 2023, season: 'Special',
    seasonTitle: 'Special Event Trails', number: 4,
    title: 'Platypus on the Rocks',
    summary: '', mainCharacter: 'Madame Mechanica', otherCharacters: [],
    themes: ['Big Summer Blow Out', 'Codes'],
    searchText: 'At the Big Summer Blow Out, a Saloon clue sends you beneath a table in the Summerhouse. A mail code leads to a Videomatic code hidden in the bathroom mirrors. Madame Mechanica appears in the video and gives you a phrase to repeat at the Saloon to show your allegiance.',
    pdf: specialPdf, image: null,
  };
  eventTrail.summary = summarise(eventTrail.searchText);
  const position = trails.findIndex(trail => trail.id === '2023-special-3');
  trails.splice(position + 1, 0, eventTrail);
}
const moonshot = trails.find(trail => trail.id === '2024-spring-11');
if (moonshot) moonshot.secret = true;

fs.writeFileSync(indexPath, JSON.stringify(trails, null, 2) + '\n');
