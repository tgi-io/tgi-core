#### TGI CORE
<p>Core Objects.</p>
&nbsp;<b><i>CORE function exposes library:</i></b>
```javascript
return typeof CORE;
```
<blockquote>returns <strong>function</strong> as expected
</blockquote>
&nbsp;<b><i>UTILITY functions are available in closure:</i></b>
```javascript
return typeof inheritPrototype;
```
<blockquote>returns <strong>function</strong> as expected
</blockquote>
#### Attribute Class
<p>Attributes are the means for models to represent data of different types.  They have no dependencies on Models however and can be used without creating a model.</p>
#### CONSTRUCTOR
&nbsp;<b><i>objects created should be an instance of Attribute:</i></b>
```javascript
return new Attribute({name: 'name'}) instanceof Attribute;
```
<blockquote>returns <strong>true</strong> as expected
</blockquote>