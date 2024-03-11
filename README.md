# PeerPass Backend

PeerPass – your digital life manager. Pure P2P, everything is encrypted by default. Full control in your hands, no more data breaches. The goal is to be an alternative to well-known password managers like [LastPass](https://www.cybersecuritydive.com/news/lastpass-cyberattack-timeline/643958/) and [1Password](https://www.cybersecuritydive.com/news/1password-okta-breach/697636/) (**both have breached**). The main difference is that this is FOSS (Free and Open Source Software) and peer-to-peer, meaning **you** own your data. No compromises, no middlemen, no servers—just you and your key pair.

Built using P2P building blocks by [Holepunch](https://holepunch.to) - Developed and deployed on [Pear runtime](https://docs.pears.com)

> Frontend and backend are separated into their own repositories; this is the backend repository. [You can find the frontend from here.](https://github.com/MKPLKN/peer-pass)


## Architecture
The architecture is an experiment to separate each piece into its own module (`./src/modules`), making each functionality swappable (easier to test) and reusable in any p2p app. So far, so good; I've been using the modules internally in a few different p2p apps, but changes are expected.
