import * as React from "react"
import "../styles/main.css"

const Tweet = () => (
  <div className="tweetContainer">
    <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Websites. Something doesn&#39;t have to be beautiful to be useable- agree or disagree?
      <a href="https://twitter.com/hashtag/webdevelopment?src=hash&amp;ref_src=twsrc%5Etfw">#webdevelopment</a>
      <a href="https://twitter.com/hashtag/userinterface?src=hash&amp;ref_src=twsrc%5Etfw">#userinterface</a><a href="https://twitter.com/hashtag/ornz17?src=hash&amp;ref_src=twsrc%5Etfw">#ornz17</a>
      </p>
      &mdash; Lennie (@lennie_law)
      <a href="https://twitter.com/lennie_law/status/839941393648766976?ref_src=twsrc%5Etfw">March 9, 2017</a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js"></script>
  </div>
)

export default Tweet