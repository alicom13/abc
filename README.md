# ABC Theme
ABC Theme / Atlantis Blesta Client Theme. The simple theme for Besta  [Blesta](https://account.blesta.com/order/forms/a/MzYyNDE=).

This convert from default [Blesta v.5.7.1](https://account.blesta.com/order/forms/a/MzYyNDE=) and [Atlantis Admin Dasboatd](https://themekita.com/demo-atlantis-lite-bootstrap/) Lite Version
## Installation
1. Upload All Source Code to blesta_dir/app/views/client/abc/
2. Login to Admin account and navigate to
> Settings > Look and Feel > Template
3. Select abc in Client Template
4. Save

# Plugins
## Portal
    <div class="col-md-4 col-sm-6 portal-box">
        <a href="{client_url}login/">
            <div class="card border border-warning rounded text-black">
                <div class="card-body">
                    <i class="fas fa-cogs fa-4x"></i>
                    <h4>My Account</h4>
                    <p>Have an account with us? Log in here to manage your account.</p>
                </div>
            </div>
        </a>
    </div>
    {% if plugins.support_manager.enabled %}<div class="col-md-4 col-sm-6 portal-box">
        <a href="{client_url}plugin/support_manager/client_tickets/add/">
            <div class="card border border-warning rounded text-black">
                <div class="card-body">
                    <i class="fas fa-ticket-alt fa-4x"></i>
                    <h4>Support</h4>
                    <p>Looking for help? You can open a trouble ticket here.</p>
                </div>
            </div>
        </a>
    </div>
	<div class="col-md-4 col-sm-6 portal-box">
        <a href="{client_url}plugin/support_manager/knowledgebase/">
            <div class="card border border-warning rounded text-black">
                <div class="card-body">
                    <i class="fas fa-info-circle fa-4x"></i>
                    <h4>Knowledge Base</h4>
                    <p>Have a question? Search the knowledge base for an answer.</p>
                </div>
            </div>
        </a>
    </div>{% endif %}
    {% if plugins.order.enabled %}<div class="col-md-4 col-sm-6 portal-box">
        <a href="{blesta_url}order/">
            <div class="card border border-warning rounded text-black">
                <div class="card-body">
                    <i class="fas fa-shopping-cart fa-4x"></i>
                    <h4>Order</h4>
                    <p>Visit the order form to sign up and purchase new products and services.</p>
                </div>
            </div>
        </a>
    </div>{% endif %}
    {% if plugins.download_manager.enabled %}<div class="col-md-4 col-sm-6 portal-box">
        <a href="{client_url}plugin/download_manager/">
            <div class="card border border-warning rounded text-black">
                <div class="card-body">
                    <i class="fas fa-download fa-4x"></i>
                    <h4>Download</h4>
                    <p>You may need to be logged in to access certain downloads here.</p>
                </div>
            </div>
        </a>
    </div>{% endif %}
