const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">About Dev Resources</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Dev Resources is a curated collection of programming resources to help
        developers at all skill levels improve their craft.
      </p>
      <div className="grid gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground">
            To provide a comprehensive, organized platform for developers to
            discover high-quality learning resources across different domains of
            software development.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Curated resources for frontend, backend, and DevOps</li>
            <li>Difficulty levels to match your experience</li>
            <li>Mix of free and paid high-quality content</li>
            <li>Regular updates with new resources</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
