from flask import Flask, render_template, request, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("main_page.html");

@app.route("/christmas_story")
def christmas_story():
    return render_template("christmas_story.html");

@app.route("/buy_tickets/<play_name>", methods=["POST"])
def buy_tickets(play_name):
    return render_template("buy_tickets.html", play_name = play_name)

@app.route("/order_summary/<play_name>", methods=["POST"])
def order_summary(play_name):
    order_summary = {
        "play_name" : play_name,
        "date_and_time" : request.form["date_and_time"],
        "seat" : {
            "zone" : request.form["zone"],
            "sector" : request.form["sector"]
        },
        "customer_name" : request.form["customer_name"],
        "ticket_price" : "$100.00"
    }
    return render_template("order_summary.html", order_summary = order_summary)

if __name__ == "__main__":
    app.run(debug=True)