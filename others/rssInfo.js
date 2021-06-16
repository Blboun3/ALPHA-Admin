module.exports = {
  sources : ["NodeJS", "C++", "Python", "Java", "Linux", "Windows", "Matematika", "Obecné"], // Typy RSS channelů, kategorie
  rss : [
    /*------------------------------------
                    NodeJS
    -------------------------------------*/
    {
      // Risingstack RSS - risingstack.com
      name: "risingstack.com",
      baseURL: "https://blog.risingstack.com/rss/",
      category: "NodeJS"
    },
    {
      // Nodesource RSS - nodesource.com
      name: "nodesource.com",
      baseURL: "https://nodesource.com/blog/rss",
      category: "NodeJS"
    },
    {
      // NodeJS RSS - nodejs.org
      name: "nodejs.org",
      baseURL: "nodejs.org/en/feed/blog.xml",
      category: "NodeJS"
    },
    /*------------------------------------
                    C++
    -------------------------------------*/
    {
      // isocpp RSS, Standard C++ - isocpp.org
      name: "isocpp.org",
      baseURL: "https://isocpp.org/blog/rss",
      category: "C++"
    },
    {
      // meetingcpp RSS - meetingcpp com
      name: "meetingcpp.com",
      baseURL: "https://meetingcpp.com/feed.xml",
      category: "C++"
    },
    /*------------------------------------
                    Python
    -------------------------------------*/
    {
      // realpython RSS - realpython.com
      name: "realpython.com",
      baseURL: "https://realpython.com/atom.xml?format=xml",
      category: "Python"
    },
    {
      // Python Software Foundation - pyfound.blogspot.com
      name: "Python Software Foundation",
      baseURL: "http://pyfound.blogspot.com/atom.xml",
      category: "Python"
    },
    {
      // Planet SciPy - planet.scipy.org
      name: "Planet SciPy",
      baseURL: "https://planet.scipy.org/feed.xml",
      category: "Python"
    },
    /*------------------------------------
                    Java
    -------------------------------------*/
    {
      // Oracle Blogs - blog.oracle.com
      name: "Oracle Blogs",
      baseURL: "https://blogs.oracle.com/java/rss",
      category: "Java"
    },
    {
      // Java Code Geeks RSS - javacodegeeks.com
      name: "javacodegeeks.com",
      baseURL: "https://www.javacodegeeks.com/feed",
      category: "Java"
    },
    {
      // Infoworld Java - infoworld.com/category/java
      name: "Infoworld - Java",
      baseURL: "https://www.infoworld.com/category/java/index.rss",
      category: "Java"
    },
    /*------------------------------------
                    Linux
    -------------------------------------*/
    {
      // Tecmint RSS - tecmint.com/feed
      name: "tecmint.com",
      baseURL: "https://www.tecmint.com/feed/",
      category: "Linux"
    },
    {
      // It's F.O.S.S RSS - itsfoss.com
      name: "It's F.O.S.S.",
      baseURL: "https://www.itsfoss.com/feed/",
      category: "Linux"
    },
    {
      // Arch Linux RSS - archlinux.org
      name: "archlinux.org",
      baseURL:"https://archlinux.org/feeds/news/",
      category: "Linux"
    },
    /*------------------------------------
                    Windows
    -------------------------------------*/
    {
      // Windows blog - blog.windows.com
      name: "The Windows Blog",
      baseURL: "https://blogs.windows.com/b/mainfeed.aspx",
      category: "Windows"
    },
    {
      // Windows Central RSS - windowscentral.com
      name: "Windows Central",
      baseURL: "https://www.windowscentral.com/rss",
      category: "Windows"
    },
    {
      // Onmsft RSS - onmsft.com
      name: "onmsft.com",
      baseURL: "https://www.onmsft.com/feed",
      category: "Widnows"
    },
    /*------------------------------------
                    Matematika
    -------------------------------------*/
    {
      // Stephen Wolfram's blog - stephenwolfram.com
      name: "Stephen Wolfram's blog",
      baseURL: "https://writings.stephenwolfram.com/feed/",
      category: "Matematika"
    },
    {
      // Math with Bad Drawings - mathwithbadrawings.com
      name: "Math with bad drawings",
      baseURL: "https://mathwithbaddrawings.com/feed/",
      category: "Matematika"
    },
    {
      // Just math - terrytao.wordpress.com
      name: "What's new in math",
      baseURL: "https://terrytao.wordpress.com/feed/",
      category: "Matematika"
    },
    /*------------------------------------
                    Obecné
    -------------------------------------*/
    {
      // OSEL - osel.cz
      name: "OSEL.cz",
      baseURL: "https://www.osel.cz/rss/rss.php",
      category: "Obecné"
    },
    { // Novinky.cz RSS - novinky.cz/RSS
      name: "Novinky.cz",
      baseURL: "https://www.novinky.cz/rss",
      category: "Obecné"
    },
    {
      // Živě.cz
      name: "Živě.cz",
      baseURL: "https://www.zive.cz/rss",
      category: "Obecné"
    }
  ]
};
