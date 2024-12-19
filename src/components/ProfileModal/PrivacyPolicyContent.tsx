const PrivacyPolicyContent = () => {
  return (
    <div className="flex flex-col items-start gap-3 overflow-auto">
      <h1 className="text-lg font-semibold text-blue-primary">
        Privacy Policy
      </h1>
      <div className="flex flex-col items-start self-stretch">
        <p className="text-sm">
          The Jennifer Ann Crecente Memorial Group, Inc., commonly known as
          &quot;`Jennifer Ann&apos;s Group&quot;, is a Code Section 501(c)(3)
          public charity based in Atlanta, Georgia. Our privacy policy is clear:
          We will collect no personal information about you when you visit our
          website unless you choose to provide that information to us. Here is
          how we handle information about your visit to our website:
        </p>
        <br></br>
        <h2 className="pb-3 font-semibold text-gray-500">
          1. Information Collected and Stored Automatically
        </h2>
        <p className="text-sm">
          If you do nothing during your visit but browse through the website,
          read pages, or download information, we will gather and store certain
          information about your visit automatically. This information does not
          identify you personally. Our software automatically collects and
          stores only the following information about your visit:
        </p>
        <br></br>
        <p className="text-sm">
          1. IP address (a number that is automatically assigned to your
          computer whenever you are surfing the Web)<br></br>
          2. The date and time you access our site;<br></br>
          3. The pages you visit; and<br></br>
          4. If you linked to Jennifer Ann&apos;s Group website from another
          website, the address of that website.<br></br>
        </p>
        <br></br>
        <p className="text-sm">
          We use this information to help us make our site more useful to
          visitors—to learn about the number of visitors to our site and the
          types of technology our visitors use. We do not track or record
          information about individuals and their visits.
        </p>
      </div>
      <div className="flex flex-col items-start self-stretch">
        <h2 className="pb-3 font-semibold text-gray-500">
          2. Personal Information Collected
        </h2>
        <p className="text-sm">
          If you choose to provide us with personal information by choosing to
          let us use your data to improve the website, our data collection and
          retention practices fall in line with the General Data Protection
          Regulation (GDPR). These are a set of rules established in the
          European Union to ensure that corporations and entities and ensuring
          the privacy and protection of personal data of their users. GDPR puts
          the protection of the user data at the forefront of the data analytics
          collection of the application. While this information identifies the
          user personally, we are storing the information to better understand
          our audience and their experiences on our website:
        </p>
        <br></br>
        <p className="text-sm">
          1. Game pages visited;<br></br>
          2. Games downloaded on the website;<br></br>
          3. Number of games played and the frequency;<br></br>
          4. Type of user account;<br></br>
          5. Supplementary materials downloaded;<br></br>
          6. User account details: name, email address,<br></br>
          password for authentication and authorization<br></br>
        </p>
        <br></br>
        <p className="text-sm">
          Data collected will not be retained for any longer than six months.
          The user can choose to opt out or opt into data collection at any time
          using the ‘Profile’ modal. Upon deletion of an account, all the data
          associated with the account will be deleted within six months. if the
          user is younger than the minimum age of digital consent as specified
          in COPPA. the data will be deleted immediately/within one month. The
          information provided is not given to any private organizations or
          private persons. Jennifer Ann&apos;s Group does not collect or use
          information for commercial marketing. The user can contact Jennifer
          Ann’s Group to learn more about our data collection practices.
        </p>
      </div>
      <div className="flex flex-col items-start self-stretch">
        <br></br>
        <h2 className="pb-3 font-semibold text-gray-500">
          3. Links to Other Sites
        </h2>
        <p className="text-sm">
          Our website has links to external websites. Once you link to another
          site, you are subject to the privacy policy of the new site.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
