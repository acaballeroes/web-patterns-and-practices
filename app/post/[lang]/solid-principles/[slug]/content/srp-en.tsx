import { CodeBlock } from "@/components/code-block";

export function SrpContentEn() {
  return (
    <>
      {/* Introduction */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
        <p>
          The Single Responsibility Principle (SRP) states:{" "}
          <span className="font-semibold">
            a class should have one, and only one, reason to change
          </span>
          . In other words, each module or class should be responsible for only
          one part of the functionality provided by the software, and that
          responsibility should be entirely encapsulated by the class.
        </p>
        <p>
          SRP is the first of the SOLID principles and often the most
          misunderstood. It does not mean a class should have only one method.
          It means that all methods and properties of the class should be
          aligned with a single purpose or concern. When a class does too much,
          it becomes a magnet for change, each new requirement touches the same
          class, increasing the risk of bugs.
        </p>
        <p>
          In this article, we explore SRP through a real-world scenario:
          building a Community of Practice management system. You will see how
          Gathering&apos;s architecture cleanly separates responsibilities, and
          what happens when you mix them.
        </p>
      </div>

      {/* The Problem */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          The Problem: Classes That Do Too Much
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          A Simple Example: Report Service
        </h3>

        <p>
          Before diving into Gathering&apos;s code, let&apos;s see a simple SRP
          violation: a report service that handles data generation, formatting,
          and email sending in a single class.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Without SRP: One Class with Multiple Responsibilities
        </h4>

        <CodeBlock language="csharp">
          {
            'public class ReportService\n{\n    // Responsibility 1: Get data\n    public DataTable GetSalesData(DateTime from, DateTime to)\n    {\n        using var connection = new SqlConnection("...");\n        var query = "SELECT * FROM Sales WHERE Date BETWEEN @from AND @to";\n        // ...\n    }\n\n    // Responsibility 2: Format the report\n    public string FormatAsHtml(DataTable data)\n    {\n        var html = "<html><body><table>";\n        foreach (DataRow row in data.Rows)\n        {\n            html += "<tr>";\n            foreach (var item in row.ItemArray)\n                html += $"<td>{item}</td>";\n            html += "</tr>";\n        }\n        return html + "</table></body></html>";\n    }\n\n    // Responsibility 3: Send email\n    public void SendReport(string htmlContent, string recipient)\n    {\n        var smtpClient = new SmtpClient("smtp.company.com");\n        var message = new MailMessage("reports@company.com", recipient)\n        {\n            Body = htmlContent,\n            IsBodyHtml = true\n        };\n        smtpClient.Send(message);\n    }\n\n    // Responsibility 4: Orchestrate everything\n    public void GenerateAndSendReport(\n        DateTime from, DateTime to, string recipient)\n    {\n        var data = GetSalesData(from, to);\n        var html = FormatAsHtml(data);\n        SendReport(html, recipient);\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problems with This Class:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Data Access:</span> Switching from
              SQL Server to PostgreSQL requires modifying ReportService.
            </li>
            <li>
              <span className="font-semibold">Format:</span> Adding PDF format
              requires modifying ReportService.
            </li>
            <li>
              <span className="font-semibold">Sending:</span> Switching from
              SMTP to SendGrid requires modifying ReportService.
            </li>
            <li>
              <span className="font-semibold">Testing:</span> You cannot test
              formatting without a real database.
            </li>
          </ul>
        </div>

        <h4 className="text-base font-semibold text-foreground mt-4">
          With SRP: Separated Responsibilities
        </h4>

        <CodeBlock language="csharp">{`// Each class has ONE reason to change

public interface ISalesDataProvider
{
    DataTable GetSalesData(DateTime from, DateTime to);
}

public interface IReportFormatter
{
    string Format(DataTable data);
}

public interface IReportSender
{
    void Send(string content, string recipient);
}

// Orchestration class only coordinates
public class ReportService
{
    private readonly ISalesDataProvider _dataProvider;
    private readonly IReportFormatter _formatter;
    private readonly IReportSender _sender;

    public ReportService(
        ISalesDataProvider dataProvider,
        IReportFormatter formatter,
        IReportSender sender)
    {
        _dataProvider = dataProvider;
        _formatter = formatter;
        _sender = sender;
    }

    public void GenerateAndSendReport(
        DateTime from, DateTime to, string recipient)
    {
        var data = _dataProvider.GetSalesData(from, to);
        var content = _formatter.Format(data);
        _sender.Send(content, recipient);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Benefits of SRP Here:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Testable:</span> Each component
              can be tested in isolation with mocks.
            </li>
            <li>
              <span className="font-semibold">✓ Interchangeable:</span> Changing
              from HTML to PDF format only requires a new implementation of
              IReportFormatter.
            </li>
            <li>
              <span className="font-semibold">✓ Focused:</span> Each class has
              one reason to change.
            </li>
          </ul>
        </div>

        <p className="mt-6">
          This simple pattern (separating data access, business logic, and
          presentation) is the foundation of SRP. Now let&apos;s apply it to a
          larger, real-world system.
        </p>
      </div>

      {/* Case Study: Gathering */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Separation of Responsibilities in Gathering
        </h2>

        <p>
          Gathering, our Community of Practice management system, demonstrates
          SRP in every layer of the architecture. Each class has a clear purpose
          and a single reason to change.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Domain Entity: Session
        </h3>

        <p>
          The Session class is exclusively responsible for the business logic of
          a session: its validation rules, state transitions, and domain events.
        </p>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Sessions/Session.cs
// SINGLE Responsibility: session business logic
public sealed partial class Session : AuditableEntity
{
    public Guid Id { get; private set; }
    public Guid CommunityId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Speaker { get; private set; } = string.Empty;
    public DateTimeOffset ScheduledAt { get; private set; }
    public SessionStatus Status { get; private set; }

    public static Result<Session> Create(
        Guid communityId, string title, string speaker,
        DateTimeOffset scheduledAt, string? description = null,
        string? image = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Result.Failure<Session>(SessionError.TitleRequired);

        if (scheduledAt <= DateTimeOffset.UtcNow)
            return Result.Failure<Session>(SessionError.ScheduledInPast);

        var session = new Session
        {
            Id = Guid.NewGuid(),
            CommunityId = communityId,
            Title = title,
            Speaker = speaker,
            ScheduledAt = scheduledAt,
            Status = SessionStatus.Scheduled
        };

        session.Raise(new SessionCreatedDomainEvent(session.Id));
        return Result.Success(session);
    }

    public Result UpdateStatus(SessionStatus newStatus)
    {
        if (Status == SessionStatus.Canceled && 
            newStatus == SessionStatus.Scheduled)
            return Result.Failure(SessionError.InvalidStatusTransition);

        if (Status == SessionStatus.Completed && 
            newStatus == SessionStatus.Scheduled)
            return Result.Failure(SessionError.InvalidStatusTransition);

        Status = newStatus;
        return Result.Success();
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Command Handler: One Operation
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Sessions/Create/CreateSessionCommandHandler.cs
// SINGLE Responsibility: orchestrating session creation
public sealed class CreateSessionCommandHandler 
    : ICommandHandler<CreateSessionCommand, Guid>
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateSessionCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    // Each dependency has its own responsibility
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

    public async Task<Result<Guid>> HandleAsync(
        CreateSessionCommand command, CancellationToken ct = default)
    {
        // Step 1: Validate the command
        var validationResult = await _validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result.Failure<Guid>(/* validation error */);

        // Step 2: Verify that community exists
        var community = await _communityRepository
            .GetByIdAsync(command.CommunityId, ct);
        if (community is null)
            return Result.Failure<Guid>(CommunityError.NotFound);

        // Step 3: Create the session (delegates to domain)
        var result = Session.Create(
            command.CommunityId, command.Title, 
            command.Speaker, command.ScheduledAt);
        if (result.IsFailure)
            return Result.Failure<Guid>(result.Error);

        // Step 4: Persist
        _sessionRepository.Add(result.Value);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result.Success(result.Value.Id);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            SRP in Each Layer:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">Session (Domain):</span> Only
              business logic (validation, state, events). Knows nothing about
              databases or HTTP.
            </li>
            <li>
              <span className="font-semibold">
                CreateSessionCommandHandler (Application):
              </span>{" "}
              Only orchestration (validates, verifies, delegates to domain,
              persists. Contains no business logic.
            </li>
            <li>
              <span className="font-semibold">
                SessionRepository (Infrastructure):
              </span>{" "}
              Only data access (EF Core queries). Has no business or application
              logic.
            </li>
            <li>
              <span className="font-semibold">
                IImageStorageService (Abstraction):
              </span>{" "}
              Only image storage. Does not care who uses it or why.
            </li>
          </ul>
        </div>
      </div>

      {/* TypeScript Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          SRP in TypeScript
        </h2>

        <p>
          The same principles apply in TypeScript. Here is the pattern of
          separation of concerns in a Node.js/Express context:
        </p>

        <CodeBlock language="typescript">
          {`// ✗ VIOLATION: One class that does everything
class SessionManager {
  async createSession(data: CreateSessionDto) {
    // Validation (responsibility 1)
    if (!data.title) throw new Error("Title required");
    if (data.scheduledAt <= new Date()) throw new Error("Must be future");

    // Data access (responsibility 2)  
    const community = await prisma.community.findUnique({
      where: { id: data.communityId }
    });
    if (!community) throw new Error("Community not found");

    // Business logic (responsibility 3)
    const session = await prisma.session.create({
      data: { ...data, status: "scheduled" }
    });

    // Notification (responsibility 4)
    await sendEmail(community.adminEmail, "New session created");
    
    return session;
  }
}

// ✓ CORRECT: Responsibilities separated
interface SessionRepository {
  create(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
}

interface CommunityRepository {
  findById(id: string): Promise<Community | null>;
}

interface NotificationService {
  notifySessionCreated(session: Session): Promise<void>;
}

class CreateSessionHandler {
  constructor(
    private sessions: SessionRepository,
    private communities: CommunityRepository,
    private notifications: NotificationService
  ) {}

  async handle(command: CreateSessionCommand): Promise<Result<Session>> {
    const community = await this.communities.findById(command.communityId);
    if (!community) return failure("Community not found");

    const session = Session.create(
      command.communityId,
      command.title,
      command.speaker,
      command.scheduledAt
    );

    if (!session.isSuccess) return failure(session.error);

    await this.sessions.create(session.value);
    await this.notifications.notifySessionCreated(session.value);

    return success(session.value);
  }
}`}
        </CodeBlock>
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
public class CreateSessionCommandValidatorTests
{
    private CreateSessionCommandValidator _validator = null!;

    [SetUp]
    public void Setup() => _validator = new CreateSessionCommandValidator();

    [Test]
    public void Validate_WithEmptyTitle_ReturnsError()
    {
        var command = new CreateSessionCommand 
        { 
            Title = "", 
            ScheduledDate = DateTime.UtcNow.AddDays(7),
            Speaker = "John Doe"
        };

        var result = _validator.Validate(command);

        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Contains.Item("Title is required"));
    }

    [Test]
    public void Validate_WithValidData_ReturnsSuccess()
    {
        var command = new CreateSessionCommand 
        { 
            Title = "SOLID Principles Workshop",
            ScheduledDate = DateTime.UtcNow.AddDays(7),
            Speaker = "Jane Smith"
        };

        var result = _validator.Validate(command);

        Assert.That(result.IsValid, Is.True);
        Assert.That(result.Errors, Is.Empty);
    }
}

// Tests for Session.Create() - Pure domain logic tests
[TestFixture]
public class SessionDomainTests
{
    [Test]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var result = Session.Create(
            communityId: Guid.NewGuid(),
            title: "Clean Code Practices",
            speaker: "Robert Martin",
            scheduledAt: DateTimeOffset.UtcNow.AddDays(7)
        );

        Assert.That(result.IsSuccess, Is.True);
        Assert.That(result.Value.Title, Is.EqualTo("Clean Code Practices"));
        Assert.That(result.Value.Status, Is.EqualTo(SessionStatus.Scheduled));
    }

    [Test]
    public void Create_WithPastDate_ReturnsFailure()
    {
        var result = Session.Create(
            communityId: Guid.NewGuid(),
            title: "SOLID Workshop",
            speaker: "SOLID Expert",
            scheduledAt: DateTimeOffset.UtcNow.AddDays(-1)
        );

        Assert.That(result.IsFailure, Is.True);
        Assert.That(result.Error, Is.EqualTo(SessionError.ScheduledInPast));
    }
}

// Tests for CreateSessionCommandHandler - Uses controlled mocks
[TestFixture]
public class CreateSessionCommandHandlerTests
{
    private CreateSessionCommandHandler _handler = null!;
    private Mock<ISessionRepository> _sessionRepositoryMock = null!;
    private Mock<ICommunityRepository> _communityRepositoryMock = null!;
    private Mock<IUnitOfWork> _unitOfWorkMock = null!;
    private Mock<IValidator<CreateSessionCommand>> _validatorMock = null!;

    [SetUp]
    public void Setup()
    {
        _sessionRepositoryMock = new Mock<ISessionRepository>();
        _communityRepositoryMock = new Mock<ICommunityRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _validatorMock = new Mock<IValidator<CreateSessionCommand>>();

        _handler = new CreateSessionCommandHandler(
            _sessionRepositoryMock.Object,
            _communityRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _validatorMock.Object,
            new NoOpImageStorageService()
        );
    }

    [Test]
    public async Task HandleAsync_WithValidCommand_CreatesSession()
    {
        var communityId = Guid.NewGuid();
        var command = new CreateSessionCommand 
        { 
            CommunityId = communityId,
            Title = "Design Patterns",
            Speaker = "Gang of Four",
            ScheduledDate = DateTime.UtcNow.AddDays(7)
        };

        var community = new Community { Id = communityId, Name = "Architects" };
        
        _validatorMock
            .Setup(v => v.ValidateAsync(command, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());
        
        _communityRepositoryMock
            .Setup(r => r.GetByIdAsync(communityId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(community);

        var result = await _handler.HandleAsync(command);

        Assert.That(result.IsSuccess, Is.True);
        _sessionRepositoryMock.Verify(r => r.Add(It.IsAny<Session>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          2. Changes Are Localized
        </h3>
        <p>
          Changing the image storage provider only affects
          AzureBlobStorageService. The handler, validation, and domain do not
          change.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          3. Readability
        </h3>
        <p>
          Each file has a clear purpose. You can understand what a class does by
          reading its name and constructor.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          4. Parallel Development
        </h3>
        <p>
          One developer can work on the repository while another works on
          validation. There are no conflicts because responsibilities are
          separated.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          5. Reusability
        </h3>
        <p>
          IImageStorageService can be used by any handler that needs to store
          images. It is not tied to one specific operation.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Common Mistakes</h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Mistake 1: Taking SRP to the Extreme
        </h3>
        <p>
          SRP does not mean one class per method. It means one cohesive
          responsibility per class. Session has multiple methods (Create,
          UpdateStatus, Update) but all serve the same responsibility: managing
          the business logic of a session.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Mistake 2: Confusing Layers with Responsibilities
        </h3>
        <p>
          Having a &ldquo;ServiceLayer&rdquo; does not mean all classes in it
          have one responsibility. A CommunityService that handles creation,
          update, deletion, and queries has at least four reasons to change.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Mistake 3: Ignoring Cohesion
        </h3>
        <p>
          If you separate too much, you end up with classes that don&apos;t make
          sense on their own. The key is to group things that change together
          and separate things that change for different reasons.
        </p>
      </div>

      {/* Checklist for SRP */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detecting SRP Violations
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
            <label>Does your class have more than one reason to change?</label>
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
              Does the class name need the words &ldquo;and&rdquo; or
              &ldquo;or&rdquo; to describe what it does?
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
              Do you need to import infrastructure packages (SMTP, SQL, Azure
              SDK) into your business logic?
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
              Does your test need to mock more than 3-4 dependencies?
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
              Does a change in UI requirements force you to change persistence
              logic?
            </label>
          </div>
        </div>

        <p>
          If you answer &ldquo;yes&rdquo; to any of these, SRP is likely being
          violated.
        </p>
      </div>

      {/* Conclusion */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>
        <p>
          The Single Responsibility Principle is the foundation of maintainable
          code. When each class has one reason to change, you can understand it,
          test it, and modify it without affecting the entire system.
        </p>
        <p>
          The key insight:{" "}
          <span className="font-semibold">
            ask yourself, &ldquo;what are the reasons this class might need to
            change?&rdquo;
          </span>{" "}
          If the answer is more than one, you have found a violation of SRP.
        </p>
        <p>
          In the next article, we will explore the Open/Closed Principle, which
          builds on SRP to ensure that adding new behavior does not require
          modifying existing code.
        </p>
      </div>
    </>
  );
}
