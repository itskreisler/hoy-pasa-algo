import nox


@nox.session
def test_api(session):
    session.install("pytest", "requests")
    session.run("pytest", external=True)
