import { PostLayout } from "@/components/post-layout";
import { CodeBlock } from "@/components/code-block";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";

export const metadata = {
  title: "Single Responsibility Principle - SOLID Principles",
  description:
    "Master the Single Responsibility Principle through a real-world Community of Practice management system with comprehensive C# and TypeScript examples.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug(
    "solid-principles",
    "single-responsibility",
  );

  if (!article) {
    return <div></div>;
  }

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-base leading-relaxed text-foreground/80">
        {/* Introduction */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
          <p>
            The Single Responsibility Principle (SRP) is deceptively simple to
            state but profound in its implications:{" "}
            <span className="font-semibold">
              a class should have one and only one reason to change
            </span>
            .
          </p>
          <p>
            What makes SRP difficult is not understanding the rule—it is
            recognizing when you have violated it. A class that parses CSV data,
            validates records, formats errors, and logs output might feel like a
            natural unit. But each of those concerns is a separate reason to
            change. When the CSV format shifts, the validation rules update, the
            error format changes, or logging needs evolve, you modify the same
            class repeatedly. Each change risks breaking the others.
          </p>
          <p>
            This article walks through SRP using a real-world scenario: building
            a Community of Practice management system. You will see how to
            identify responsibilities, understand why violating SRP causes pain,
            and refactor code to give each class a single, clear reason to
            change.
          </p>
        </div>

        {/* The Problem: What Happens Without SRP */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            The Problem: What Happens Without SRP
          </h2>

          {/* Simple Classic Example First */}
          <h3 className="text-lg font-semibold text-foreground mt-6">
            A Simple Example: Report Generation
          </h3>

          <p>
            Before diving into the complex CoP system, let&apos;s see a simple,
            classic example: generating a sales report. This illustrates the
            core principle without needing a large application context.
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            Without SRP: Multiple Reasons to Change
          </h4>

          <p>
            Here&apos;s a class that violates SRP by mixing data access,
            calculation, and presentation:
          </p>

          <CodeBlock language="csharp">{`public class SalesReport
{
    private readonly IDatabase _db;

    public SalesReport(IDatabase db)
    {
        _db = db;
    }

    // Reason #1 to change: Database schema or queries change
    public List<Order> GetOrdersFromDatabase()
    {
        return _db.Query("SELECT * FROM Orders WHERE OrderDate >= @date", 
            DateTime.Now.AddMonths(-1));
    }

    // Reason #2 to change: Calculation logic changes
    public decimal CalculateTotalRevenue(List<Order> orders)
    {
        return orders.Sum(o => o.Quantity * o.UnitPrice);
    }

    // Reason #3 to change: Report format or display requirements change
    public string GenerateReportText(List<Order> orders, decimal revenue)
    {
        var report = "=== SALES REPORT ===\\n";
        report += "Total Orders: " + orders.Count + "\\n";
        report += "Total Revenue: " + revenue.ToString("F2") + "\\n";
        report += "Orders:\\n";
        foreach (var order in orders)
        {
            report += "- " + order.ProductName + ": " + 
                (order.Quantity * order.UnitPrice).ToString("F2") + "\\n";
        }
        return report;
    }

    // This method calls all three responsibilities
    public void PrintMonthlyReport()
    {
        var orders = GetOrdersFromDatabase();    // Depends on: Database
        var revenue = CalculateTotalRevenue(orders);  // Depends on: Math logic
        var text = GenerateReportText(orders, revenue);  // Depends on: UI format
        Console.WriteLine(text);
    }
}`}</CodeBlock>

          <p className="mt-4">
            <span className="font-semibold">The problem:</span> If the database
            team changes the Orders table, the report format changes, or the
            revenue calculation logic changes, you modify{" "}
            <span className="font-semibold">the same class</span>. Each change
            risks breaking the others. Testing is difficult because you need a
            database to test the formatting logic.
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            With SRP: One Class, One Reason to Change
          </h4>

          <p>
            Now let&apos;s split the responsibilities into separate classes,
            each with a single reason to change:
          </p>

          <CodeBlock language="csharp">{`// Responsibility 1: Data Access (only changes if database schema changes)
public interface IOrderRepository
{
    List<Order> GetOrdersFromLastMonth();
}

public class OrderRepository : IOrderRepository
{
    private readonly IDatabase _db;

    public OrderRepository(IDatabase db)
    {
        _db = db;
    }

    public List<Order> GetOrdersFromLastMonth()
    {
        return _db.Query("SELECT * FROM Orders WHERE OrderDate >= @date",
            DateTime.Now.AddMonths(-1));
    }
}

// Responsibility 2: Business Logic (only changes if calculation rules change)
public interface IRevenueCalculator
{
    decimal CalculateTotalRevenue(List<Order> orders);
}

public class RevenueCalculator : IRevenueCalculator
{
    public decimal CalculateTotalRevenue(List<Order> orders)
    {
        return orders.Sum(o => o.Quantity * o.UnitPrice);
    }
}

// Responsibility 3: Formatting/Presentation (only changes if report format changes)
public interface IReportFormatter
{
    string Format(List<Order> orders, decimal revenue);
}

public class TextReportFormatter : IReportFormatter
{
    public string Format(List<Order> orders, decimal revenue)
    {
        var report = "=== SALES REPORT ===\\n";
        report += "Total Orders: " + orders.Count + "\\n";
        var revStr = revenue.ToString("F2");
        report += "Total Revenue: " + revStr + "\\n";
        report += "Orders:\\n";
        foreach (var order in orders)
        {
            var amt = (order.Quantity * order.UnitPrice).ToString("F2");
            report += "- " + order.ProductName + ": " + amt + "\\n";
        }
        return report;
    }
}

// Orchestrator: Coordinates the separated concerns
public class SalesReportGenerator
{
    private readonly IOrderRepository _repository;
    private readonly IRevenueCalculator _calculator;
    private readonly IReportFormatter _formatter;

    public SalesReportGenerator(IOrderRepository repository,
        IRevenueCalculator calculator, IReportFormatter formatter)
    {
        _repository = repository;
        _calculator = calculator;
        _formatter = formatter;
    }

    public void PrintMonthlyReport()
    {
        var orders = _repository.GetOrdersFromLastMonth();    // 1. Get data
        var revenue = _calculator.CalculateTotalRevenue(orders);  // 2. Calculate
        var text = _formatter.Format(orders, revenue);        // 3. Format
        Console.WriteLine(text);
    }
}

// Usage:
var repository = new OrderRepository(database);
var calculator = new RevenueCalculator();
var formatter = new TextReportFormatter();
var reportGenerator = new SalesReportGenerator(repository, calculator, formatter);
reportGenerator.PrintMonthlyReport();`}</CodeBlock>

          <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
              Benefits of SRP Here:
            </p>
            <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
              <li>
                <span className="font-semibold">✓ Easy to test:</span> Test
                RevenueCalculator without a database by mocking the inputs.
              </li>
              <li>
                <span className="font-semibold">✓ Easy to extend:</span> Want
                CSV output? Create{" "}
                <span className="font-mono">CsvReportFormatter</span>,
                don&apos;t touch the other classes.
              </li>
              <li>
                <span className="font-semibold">✓ Easy to change:</span>{" "}
                Database schema change? Modify only{" "}
                <span className="font-mono">OrderRepository</span>.
              </li>
              <li>
                <span className="font-semibold">✓ Reusable:</span> You can use{" "}
                <span className="font-mono">RevenueCalculator</span> in another
                report without copying code.
              </li>
            </ul>
          </div>

          <p className="mt-6">
            This simple pattern—separating data access, business logic, and
            presentation—is the foundation of SRP. Now let&apos;s apply it to a
            larger, real-world system.
          </p>

          {/* Case Study: Community of Practice */}
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Case Study: Community of Practice Management System
          </h3>

          <p className="mt-4">
            Imagine you are building a system for a company with multiple
            Communities of Practice (CoPs). Each CoP organizes sessions where
            members present talks, share knowledge, and collaborate. The system
            needs to track members, sessions, attendance, and notifications.
          </p>

          <p>
            A developer, eager to get the feature shipped, creates a single
            &ldquo;god class&rdquo; that handles everything:
          </p>

          {/* C# Example - Violation */}
          <CodeBlock language="csharp">
            {`
public class CreateSessionService
{
    private readonly IDatabase _db;
    private readonly IEmailService _emailService;
    private readonly ILogger _logger;

    public CreateSessionService(IDatabase db, 
        IEmailService emailService, ILogger logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    // This method mixes 5 different responsibilities into one
    public async Task CreateSessionAsync(CreateSessionRequest request)
    {
        // RESPONSIBILITY 1: Validate input
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Title is required");
        
        if (request.Title.Length > 200)
            throw new ArgumentException("Title cannot exceed 200 characters");
        
        if (string.IsNullOrWhiteSpace(request.Description))
            throw new ArgumentException("Description is required");

        if (request.ScheduledDate < DateTime.UtcNow)
            throw new ArgumentException("Session cannot be in the past");
        
        if (string.IsNullOrWhiteSpace(request.Speaker))
            throw new ArgumentException("Speaker is required");

        // RESPONSIBILITY 2: Persist to database
        var session = new Session
        {
            Id = Guid.NewGuid(),
            CommunityId = request.CommunityId,
            Title = request.Title,
            Description = request.Description,
            Speaker = request.Speaker,
            Schedule = request.ScheduledDate,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Sessions.AddAsync(session);
        await _db.SaveChangesAsync();

        // RESPONSIBILITY 3: Format data for email
        var emailBody = $@"
            <div style='font-family: Arial, sans-serif;'>
                <h2>New Session Created</h2>
                <p><strong>{session.Title}</strong></p>
                <p>Speaker: {session.Speaker}</p>
                <p>Scheduled for: {session.Schedule:MMMM d, yyyy 'at' h:mm tt}</p>
                <p><a href='https://app.gathering.local/sessions/{session.Id}'>
                   View Session</a></p>
            </div>
        ";

        // RESPONSIBILITY 4: Send notifications
        var community = await _db.Communities.FindAsync(request.CommunityId);
        var members = await _db.Members
            .Where(m => m.CommunityId == request.CommunityId)
            .ToListAsync();

        foreach (var member in members)
        {
            try
            {
                await _emailService.SendAsync(
                    member.Email,
                    $"New {community.Name} Session: {session.Title}",
                    emailBody
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to send email to {Member}", member.Email);
            }
        }

        // RESPONSIBILITY 5: Log the action
        _logger.LogInformation(
            "Session {SessionId} created in community {CommunityId}",
            session.Id, request.CommunityId);
    }
}`}
          </CodeBlock>

          <p className="mt-4">
            This single class has at least{" "}
            <span className="font-semibold">
              five separate reasons to change
            </span>
            :
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-semibold">Validation rules change:</span>{" "}
              Product says &ldquo;speakers must have 20+ characters.&rdquo;
            </li>
            <li>
              <span className="font-semibold">Database schema evolves:</span>{" "}
              Add image field, change DateTime precision, rename columns.
            </li>
            <li>
              <span className="font-semibold">Email template updates:</span>{" "}
              Marketing wants a gradient background, new branding colors.
            </li>
            <li>
              <span className="font-semibold">
                Notification channels expand:
              </span>{" "}
              Now we need SMS, Slack, push notifications too.
            </li>
            <li>
              <span className="font-semibold">
                Logging/audit requirements change:
              </span>{" "}
              Compliance says &ldquo;stop logging member emails.&rdquo;
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-semibold">The pain:</span>
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <span className="font-semibold">Testing is a nightmare:</span> You
              must mock database, email service, and logger just to test
              validation logic.
            </li>
            <li>
              <span className="font-semibold">
                Changes have wide blast radius:
              </span>{" "}
              Tweaking the email template might accidentally break the database
              call.
            </li>
            <li>
              <span className="font-semibold">Code is hard to understand:</span>{" "}
              New developers ask: &ldquo;What does this class actually
              do?&rdquo;
            </li>
            <li>
              <span className="font-semibold">Reusability is zero:</span> You
              cannot reuse the validator elsewhere. You cannot reuse the
              notifier.
            </li>
            <li>
              <span className="font-semibold">Every change is risky:</span> A
              small modification to validation logic could break persistence.
            </li>
          </ul>
        </div>

        {/* Understanding Responsibility */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Understanding Responsibility
          </h2>
          <p>
            Before we show the proper solution, let us clarify what
            &ldquo;responsibility&rdquo; means. It is not the number of methods;
            it is the{" "}
            <span className="font-semibold">number of reasons to change</span>.
          </p>
          <p>
            A helpful mental model: imagine your boss asking you to change this
            class. Every different stakeholder or business reason that could
            trigger a change represents a separate responsibility.
          </p>

          <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
              Who would ask to modify CreateSessionService?
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
              <li>
                <span className="font-semibold">Product Manager:</span>{" "}
                &ldquo;Add validation: speakers must be at least 20
                characters.&rdquo;
              </li>
              <li>
                <span className="font-semibold">Database Engineer:</span>{" "}
                &ldquo;We migrated to PostgreSQL; change your queries.&rdquo;
              </li>
              <li>
                <span className="font-semibold">Marketing:</span>{" "}
                &ldquo;Redesign the email template with our new branding.&rdquo;
              </li>
              <li>
                <span className="font-semibold">CTO:</span> &ldquo;We need SMS
                and Slack notifications, not just email.&rdquo;
              </li>
              <li>
                <span className="font-semibold">Compliance Officer:</span>{" "}
                &ldquo;Stop logging personally identifiable information.&rdquo;
              </li>
            </ul>
          </div>

          <p>
            <span className="font-semibold">
              Five different people want to change the same class.
            </span>{" "}
            This is the essence of SRP violation. Each change introduces risk
            because all five concerns are entangled in one monolithic class.
          </p>
        </div>

        {/* How to Address Each Concern */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            How to Address Each of the 5 Reasons to Change
          </h2>
          <p>
            Before we show the full code, let us outline how SRP solves each of
            the five concerns identified above:
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            1. Validation Rules
          </h3>
          <p>
            Create a dedicated{" "}
            <span className="font-semibold">CreateSessionCommandValidator</span>{" "}
            that uses FluentValidation. When the Product Manager says
            &ldquo;speakers must be 20+ characters,&rdquo; you modify only this
            class. Database, notifications, and logging remain untouched.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            2. Business Logic
          </h3>
          <p>
            Create a domain factory{" "}
            <span className="font-semibold">Session.Create()</span> that
            encapsulates all business rules. When domain logic changes, it is
            isolated from validation, persistence, and notifications.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            3. Persistence
          </h3>
          <p>
            Create a repository interface{" "}
            <span className="font-semibold">ISessionRepository</span> with an
            implementation for your database. When the Database Engineer
            migrates to PostgreSQL, only this class changes.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            4. Email Templates & Notifications
          </h3>
          <p>
            Create{" "}
            <span className="font-semibold">ISessionEmailTemplateBuilder</span>{" "}
            for email formatting, and use the{" "}
            <span className="font-semibold">Strategy pattern</span> with{" "}
            <span className="font-semibold">INotificationChannel</span> for
            multiple notification types (Email, SMS, Slack). When the CTO says
            &ldquo;add SMS,&rdquo; you create a new{" "}
            <span className="font-semibold">SmsNotificationChannel</span> class.
            Email code never changes.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            5. Logging & Audit
          </h3>
          <p>
            Create <span className="font-semibold">IAuditLogger</span> with an
            implementation that sanitizes sensitive data. When Compliance says
            &ldquo;stop logging emails,&rdquo; you modify only the audit logger.
            The handler orchestrating the workflow stays the same.
          </p>

          <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              The Key Insight:
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Each stakeholder request maps to exactly ONE class to modify. This
              minimizes risk, makes changes fast, and keeps concerns isolated.
            </p>
          </div>
        </div>

        {/* The Solution: Splitting Responsibilities */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            The Solution: Splitting Responsibilities
          </h2>
          <p>
            Now, let us see how the real Gathering repository solves this
            problem. Instead of one god class, responsibilities are cleanly
            separated so each class has{" "}
            <span className="font-semibold">one reason to change</span>:
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-4">
            SRP Applied
          </h3>

          <div className="my-6 rounded-lg border border-emerald-600 bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              Responsibility Breakdown in Gathering:
            </p>
            <ul className="text-sm space-y-2 text-emerald-900 dark:text-emerald-100">
              <li>
                <span className="font-semibold">
                  CreateSessionCommandValidator:
                </span>{" "}
                Single reason to change: validation rules
              </li>
              <li>
                <span className="font-semibold">Session.Create():</span> Single
                reason to change: business logic or domain rules
              </li>
              <li>
                <span className="font-semibold">IImageStorageService:</span>{" "}
                Single reason to change: image storage implementation
              </li>
              <li>
                <span className="font-semibold">ISessionRepository:</span>{" "}
                Single reason to change: persistence mechanism
              </li>
              <li>
                <span className="font-semibold">
                  CreateSessionCommandHandler:
                </span>{" "}
                Single reason to change: workflow orchestration
              </li>
            </ul>
          </div>

          {/* C# Refactored - Real Code */}
          <h3 className="text-xl font-semibold text-foreground mt-6">
            C# - From the Real Gathering Repository
          </h3>

          <p className="font-semibold mt-4">
            Step 1: CreateSessionCommandValidator (Single Responsibility:
            Validation)
          </p>
          <CodeBlock language="csharp">{`// From: Gathering.Application/Sessions/Create/CreateSessionCommandValidator.cs
using FluentValidation;

public sealed class CreateSessionCommandValidator :
    AbstractValidator<CreateSessionCommand>
{
    public CreateSessionCommandValidator()
    {
        RuleFor(x => x.CommunityId)
            .NotEmpty()
            .WithMessage("Community ID is required.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Session title is required.")
            .MaximumLength(200)
            .WithMessage("Session title cannot exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Session description is required.")
            .MaximumLength(1000)
            .WithMessage("Session description cannot exceed 1000 characters.");

        RuleFor(x => x.Speaker)
            .NotEmpty()
            .WithMessage("Session speaker is required.")
            .MaximumLength(100)
            .WithMessage("Speaker name cannot exceed 100 characters.");

        RuleFor(x => x.Schedule)
            .NotEmpty()
            .WithMessage("Session schedule is required.")
            .Must(schedule => schedule > DateTime.UtcNow)
            .WithMessage("Session schedule must be in the future.");

        // Conditional validation: if image provided, metadata required
        When(x => x.ImageStream is not null, () =>
        {
            RuleFor(x => x.ImageFileName)
                .NotEmpty()
                .WithMessage("Image file name is required when uploading an image.");

            RuleFor(x => x.ImageContentType)
                .NotEmpty()
                .WithMessage("Image content type is required when uploading an image.");
        });
    }
}`}</CodeBlock>

          <p className="font-semibold mt-4">
            Step 2: Session.Create() Domain Factory (Single Responsibility:
            Business Logic)
          </p>
          <CodeBlock language="csharp">{`// From: Gathering.Domain/Sessions/Session.cs (excerpt)
public static Result<Session> Create(
    Guid communityId,
    string title,
    string description,
    string speaker,
    DateTime schedule,
    string? image = null)
{
    // Validate business rules (responsibilities separated from command handler)
    if (communityId == Guid.Empty)
        return Result.Failure<Session>(SessionError.ComunityInvalid);

    if (string.IsNullOrWhiteSpace(title))
        return Result.Failure<Session>(SessionError.TitleEmpty);

    if (title.Length > 200)
        return Result.Failure<Session>(SessionError.TitleTooLong);

    if (string.IsNullOrWhiteSpace(description))
        return Result.Failure<Session>(SessionError.DescriptionEmpty);

    if (description.Length > 1000)
        return Result.Failure<Session>(SessionError.DescriptionTooLong);

    if (string.IsNullOrWhiteSpace(speaker))
        return Result.Failure<Session>(SessionError.SpeakerEmpty);

    if (speaker.Length > 100)
        return Result.Failure<Session>(SessionError.SpeakerTooLong);

    if (schedule <= DateTime.UtcNow)
        return Result.Failure<Session>(SessionError.ScheduleInvalid);

    // Create the session aggregate
    var session = new Session
    {
        Id = Guid.NewGuid(),
        CommunityId = communityId,
        Title = title,
        Description = description,
        Speaker = speaker,
        Schedule = schedule,
        Image = image,
        State = SessionState.Scheduled,
        CreatedAt = DateTime.UtcNow
    };

    // Raise domain event
    session.Raise(new SessionCreatedDomainEvent(session.Id));

    return Result.Success(session);
}`}</CodeBlock>

          <p className="font-semibold mt-4">
            Step 3: CreateSessionCommandHandler (Single Responsibility:
            Orchestration)
          </p>
          <CodeBlock language="csharp">{`// From: Gathering.Application/Sessions/Create/CreateSessionCommandHandler.cs
public sealed class CreateSessionCommandHandler : ICommandHandler<CreateSessionCommand>
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateSessionCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    public CreateSessionCommandHandler(
        ISessionRepository sessionRepository,
        ICommunityRepository communityRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateSessionCommand> validator,
        IImageStorageService imageStorageService)
    {
        _sessionRepository = sessionRepository;
        _communityRepository = communityRepository;
        _unitOfWork = unitOfWork;
        _validator = validator;
        _imageStorageService = imageStorageService;
    }

    // Only responsible for orchestrating the workflow
    public async Task<Result> HandleAsync(CreateSessionCommand request,
        CancellationToken cancellationToken = default)
    {
        // Step 1: Validate input (delegated to validator)
        var validationResult = await
            _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errorMessages = string.Join("; ",
                validationResult.Errors.Select(e => e.ErrorMessage));
            return Result.Failure(
                Error.Validation("CreateSession.ValidationFailed", errorMessages));
        }

        // Step 2: Verify community exists (separated concern)
        var communityExists = await
            _communityRepository.ExistsAsync(request.CommunityId, cancellationToken);
        if (!communityExists)
            return Result.Failure(CommunityError.NotFound);

        // Step 3: Handle optional image upload (isolated responsibility)
        string? imageUrl = null;
        if (request.ImageStream is not null && 
            request.ImageFileName is not null && 
            request.ImageContentType is not null)
        {
            var fileValidationResult = FileValidator.ValidateImageFile(
                request.ImageStream,
                request.ImageFileName,
                request.ImageContentType);

            if (fileValidationResult.IsFailure)
                return Result.Failure(fileValidationResult.Error);

            var uploadResult = await _imageStorageService.UploadImageAsync(
                request.ImageStream,
                request.ImageFileName,
                request.ImageContentType,
                "sessions",
                cancellationToken);

            if (uploadResult.IsFailure)
                return Result.Failure(uploadResult.Error);

            imageUrl = uploadResult.Value;
        }

        // Step 4: Delegate business logic to domain (separated concern)
        var sessionResult = Session.Create(
            request.CommunityId,
            request.Title,
            request.Description,
            request.Speaker,
            request.Schedule,
            imageUrl);

        if (sessionResult.IsFailure)
        {
            // Cleanup: if session creation failed after upload, delete the image
            if (imageUrl is not null)
                await _imageStorageService.DeleteImageAsync(imageUrl, cancellationToken);

            return Result.Failure(sessionResult.Error);
        }

        // Step 5: Persist (delegated to repository)
        _sessionRepository.Add(sessionResult.Value);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}`}</CodeBlock>

          {/* TypeScript Refactored - Real Patterns */}
          <h3 className="text-xl font-semibold text-foreground mt-8">
            TypeScript - Equivalent Architecture
          </h3>

          <p className="text-sm italic mb-4">
            While Gathering uses C# with MediatR, the same SRP principles apply
            in TypeScript. Here is a Node.js/Express equivalent:
          </p>

          <p className="font-semibold mt-4">
            Step 1: CreateSessionCommandValidator (Using Class-validator)
          </p>
          <CodeBlock language="typescript">{`// validators/CreateSessionCommandValidator.ts
import { validate, IsNotEmpty, MaxLength, IsUUID, IsDateString } from 'class-validator';

export class CreateSessionCommand {
  @IsUUID()
  communityId!: string;

  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @IsNotEmpty()
  @MaxLength(100)
  speaker!: string;

  @IsDateString()
  schedule!: string;

  imageStream?: Buffer;
  imageFileName?: string;
  imageContentType?: string;
}

export class CreateSessionCommandValidator {
  async validate(command: CreateSessionCommand): Promise<string[]> {
    const errors = await validate(command);
    const messages: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        Object.values(error.constraints).forEach(msg => messages.push(msg));
      }
    }

    // Custom business rule: schedule must be in the future
    const scheduleDate = new Date(command.schedule);
    if (scheduleDate <= new Date()) {
      messages.push("Session schedule must be in the future");
    }

    // Conditional: if image provided, metadata required
    if (command.imageStream !== undefined) {
      if (!command.imageFileName)
        messages.push("Image file name is required when uploading an image");
      if (!command.imageContentType)
        messages.push("Image content type is required when uploading an image");
    }

    return messages;
  }
}`}</CodeBlock>

          <p className="font-semibold mt-4">
            Step 2: Session.create() Domain Factory (Business Logic)
          </p>
          <CodeBlock language="typescript">{`// domain/sessions/Session.ts
export enum SessionState {
  Scheduled = "Scheduled",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export type Result<T> = 
  | { success: true; value: T }
  | { success: false; error: string };

export class Session {
  constructor(
    readonly id: string,
    readonly communityId: string,
    readonly title: string,
    readonly description: string,
    readonly speaker: string,
    readonly schedule: Date,
    readonly image: string | null,
    readonly state: SessionState,
    readonly createdAt: Date
  ) {}

  // Factory method encapsulates business logic
  static create(
    communityId: string,
    title: string,
    description: string,
    speaker: string,
    schedule: Date,
    image?: string
  ): Result<Session> {
    // Validate business rules (not an HTTP concern)
    if (!communityId) {
      return { success: false, error: "Community ID is required" };
    }

    if (!title?.trim()) {
      return { success: false, error: "Title is required" };
    }

    if (title.length > 200) {
      return { success: false, error: "Title cannot exceed 200 characters" };
    }

    if (!description?.trim()) {
      return { success: false, error: "Description is required" };
    }

    if (description.length > 1000) {
      return { success: false, error: "Description cannot exceed 1000 characters" };
    }

    if (!speaker?.trim()) {
      return { success: false, error: "Speaker is required" };
    }

    if (speaker.length > 100) {
      return { success: false, error: "Speaker name cannot exceed 100 characters" };
    }

    if (schedule <= new Date()) {
      return { success: false, error: "Session schedule must be in the future" };
    }

    // Create the aggregate
    const session = new Session(
      crypto.randomUUID(),
      communityId,
      title,
      description,
      speaker,
      schedule,
      image ?? null,
      SessionState.Scheduled,
      new Date()
    );

    return { success: true, value: session };
  }
}`}</CodeBlock>

          <p className="font-semibold mt-4">
            Step 3: CreateSessionCommandHandler (Orchestration)
          </p>
          <CodeBlock language="typescript">{`// handlers/CreateSessionCommandHandler.ts
import { ISessionRepository } from "../repositories/ISessionRepository";
import { ICommunityRepository } from "../repositories/ICommunityRepository";
import { IImageStorageService } from "../services/IImageStorageService";
import { CreateSessionCommand, CreateSessionCommandValidator } from "../validators/CreateSessionCommandValidator";
import { Session } from "../domain/sessions/Session";

export class CreateSessionCommandHandler {
  constructor(
    private sessionRepository: ISessionRepository,
    private communityRepository: ICommunityRepository,
    private imageStorageService: IImageStorageService,
    private validator: CreateSessionCommandValidator
  ) {}

  // Only responsible for orchestrating the workflow
  async handle(command: CreateSessionCommand): Promise<void> {
    // Step 1: Validate input (delegated)
    const validationErrors = await this.validator.validate(command);
    if (validationErrors.length > 0) {
      throw new Error(\`Validation failed: \${validationErrors.join("; ")}\`);
    }

    // Step 2: Verify community exists
    const communityExists = await this.communityRepository.exists(command.communityId);
    if (!communityExists) {
      throw new Error("Community not found");
    }

    // Step 3: Handle optional image upload (isolated)
    let imageUrl: string | undefined;
    if (command.imageStream && command.imageFileName && command.imageContentType) {
      imageUrl = await this.imageStorageService.uploadImage(
        command.imageStream,
        command.imageFileName,
        command.imageContentType,
        "sessions"
      );
    }

    // Step 4: Delegate business logic to domain factory
    const sessionResult = Session.create(
      command.communityId,
      command.title,
      command.description,
      command.speaker,
      new Date(command.schedule),
      imageUrl
    );

    if (!sessionResult.success) {
      // Cleanup if domain logic failed
      if (imageUrl) {
        await this.imageStorageService.deleteImage(imageUrl);
      }
      throw new Error(sessionResult.error);
    }

    // Step 5: Persist (delegated to repository)
    await this.sessionRepository.add(sessionResult.value);
  }
}`}</CodeBlock>
        </div>

        {/* Benefits of Applying SRP */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Benefits of Applying SRP
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            1. Testing Becomes Isolated and Fast
          </h3>
          <p>
            Without SRP, testing SessionHandler required setting up a database,
            email service, and logger. Now, to test SessionValidator, you pass a
            request object. No mocks, no side effects:
          </p>
          <CodeBlock language="csharp">{`// C# Test
[TestFixture]
public class SessionValidatorTests
{
    private SessionValidator _validator = null!;

    [SetUp]
    public void Setup() => _validator = new SessionValidator();

    [Test]
    public void Validate_WithEmptyTitle_ReturnsError()
    {
        var request = new CreateSessionRequest 
        { 
            Title = "", 
            ScheduledDate = DateTime.UtcNow.AddDays(1),
            MaxAttendees = 10
        };

        var result = _validator.Validate(request);

        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Contains.Item("Title is required"));
    }

    [Test]
    public void Validate_WithValidData_ReturnsSuccess()
    {
        var request = new CreateSessionRequest 
        { 
            Title = "Clean Code Workshop",
            ScheduledDate = DateTime.UtcNow.AddDays(7),
            MaxAttendees = 25
        };

        var result = _validator.Validate(request);

        Assert.That(result.IsValid, Is.True);
        Assert.That(result.Errors, Is.Empty);
    }
}`}</CodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            2. Changes Are Localized
          </h3>
          <p>
            If the email template needs a redesign, you modify only
            SessionEmailTemplateBuilder. If validation rules change, you touch
            only SessionValidator. The change is surgically precise and
            low-risk.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            3. Reusability Increases
          </h3>
          <p>
            SessionValidator can be used in any command that creates or updates
            a session. SessionNotifier can notify members about any event. The
            classes are small enough to be useful in multiple contexts.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            4. New Features Are Cheaper
          </h3>
          <p>
            Want to add Slack notifications? Create a SlackSessionNotifier that
            implements ISessionNotifier. The service does not change. You add
            code; you do not modify existing code. This is the Open/Closed
            Principle emerging naturally from SRP.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            5. Code Is More Readable
          </h3>
          <p>
            A class with one responsibility has a clear purpose. The name
            communicates intent. Reading CreateSessionService, you understand
            the workflow at a glance without getting lost in validation or email
            details.
          </p>
        </div>

        {/* Real-World Pitfalls and How to Avoid Them */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Real-World Pitfalls and How to Avoid Them
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 1: &ldquo;Grouping by Technical Layer&rdquo; Instead of
            Responsibility
          </h3>
          <p>
            Many developers create classes like ValidationHelper, EmailHelper,
            and DatabaseHelper. These sound responsible but are actually just
            grouping by technical layer. A &ldquo;Helper&rdquo; is a code
            smell—it usually means the responsibilities are not clear.
          </p>
          <p className="text-sm italic mt-2">
            Better: Create SessionValidator, SessionNotifier,
            SessionRepository—each clearly tied to a business responsibility.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 2: Creating Too Many Tiny Classes
          </h3>
          <p>
            It is possible to over-apply SRP. A class with two closely related
            responsibilities might be fine if they always change together. The
            goal is not to maximize the number of classes but to minimize the
            number of reasons to change.
          </p>
          <p className="text-sm italic mt-2">
            Guideline: If two responsibilities are likely to change together,
            keep them in the same class.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 3: Forgetting the Coordinator
          </h3>
          <p>
            When you split responsibilities, do not just scatter the calls
            throughout your codebase. Create a coordinator (like
            CreateSessionService) that orchestrates the workflow. This makes the
            business logic explicit and testable.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 4: Ignoring Dependency Injection
          </h3>
          <p>
            Split classes only work well if you inject dependencies. If
            SessionValidator directly instantiates a database connection, you
            have not really gained anything. Use constructor injection to make
            dependencies visible and testable.
          </p>
        </div>

        {/* Checklist for SRP */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Checklist: Does Your Class Violate SRP?
          </h2>

          <div className="space-y-3 my-4">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Can I describe the class in one sentence without using
                &ldquo;and&rdquo;?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                If I list all the reasons this class might need to change, is
                the list short (1-2 items)?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Can I test this class in isolation without mocking most of its
                dependencies?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Could this responsibility be useful in a different context?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                When requirements change, would I need to modify this class for
                multiple different reasons?
              </label>
            </div>
          </div>

          <p>
            If you answer &ldquo;no&rdquo; to any of these, SRP is likely being
            violated.
          </p>
        </div>

        {/* Conclusion */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>
          <p>
            The Single Responsibility Principle is about managing change. By
            giving each class one reason to change, you make your code more
            resilient, testable, and readable. The Community of Practice
            management system we built is a realistic scenario where SRP
            transforms a tangled mess into a clear, modular design.
          </p>
          <p>
            The key insight:{" "}
            <span className="font-semibold">
              do not ask &ldquo;how many methods does this class have?&rdquo;
              Ask instead, &ldquo;how many reasons might it need to
              change?&rdquo;
            </span>{" "}
            If the answer is more than one, you have found a violation of SRP.
          </p>
          <p>
            In the next article, we will explore the Open/Closed Principle,
            which builds on SRP to ensure that adding new behavior does not
            require modifying existing code.
          </p>
        </div>
      </div>
    </PostLayout>
  );
}
