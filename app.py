from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Produtos e preços
itens = {
    "Cadeado": 10,
    "Martelo": 25,
    "Chaves": 5,
    "Parafuso": 2,
    "Prego": 2,
    "Kit de Ferramentas": 30
}

@app.route("/")
def index():
    # Envia lista de produtos para o template
    return render_template("index.html", itens=itens)

@app.route("/checkout", methods=["POST"])
def checkout():
    carrinho = request.json.get("carrinho", [])
    total = 0
    for c in carrinho:
        qtd = c['quantidade']
        preco = c['preco']
        subtotal = qtd * preco
        if qtd >= 5:
            subtotal *= 0.9  # desconto de 10%
        total += subtotal
        c['subtotal'] = round(subtotal, 2)
    total = round(total, 2)
    return jsonify({"carrinho": carrinho, "total": total})

if __name__ == "__main__":
    app.run(debug=True)