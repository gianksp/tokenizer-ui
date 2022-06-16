## NFT Tokenizer Template

This template is designed to be used within the [Dappify](http://dappify.com "Dappify") ecosystem.

#### Configurable Properties

1. Preselect chainId and do not allow selection of other chains
```
type: option,
key: chainId,
value: 0x1
```

2. Enable lazy minting if exists, value contains the uri to redirect back to the user (e.g the url of the profile section of the NFT market template)
```
type: option,
key: lazy,
value: https://marketplace.mysubdomain.dappify.com/profile
```

3. Set an image background
```
type: layout,
key: background,
value: <image_url>
```

#### Author
Dappify
